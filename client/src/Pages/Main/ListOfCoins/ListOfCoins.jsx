import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

export default function ListOfCoins() {
  const [coins, setCoins] = useState([]);
  const [value, setValue] = useState("");
  const [searchResult, setSearchResult] = useState(true);
  // eslint-disable-next-line
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const allParameters = Object.fromEntries([...searchParams]);
  const query = Object.entries(allParameters)
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  const handleSubmit = (e) => {
    e.preventDefault();
    // setClicked(true);
    navigate(`/search?q=` + value);
    setValue("");
  };
  useEffect(() => {
    fetch(`http://localhost:5000/search?${query}`, {
      headers: {
        "api-key": "Elvin1234",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.length === 0) {
          return setSearchResult(false);
        }
        setSearchResult(true);
        setCoins(data);
      });
  }, [query]);
  return (
    <div className="list-of-coins">
      <h1 className="home-page-header">List of the coins</h1>
      <div className="search-input">
        <form
          onSubmit={handleSubmit}
          className="search-input-form"
          action="submit"
        >
          <label htmlFor="search-input">Input field</label>
          <div className="input-button">
            <input
              type="text"
              name="search-input"
              id="search-input"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
            <button className="search-button" type="submit">
              Search
            </button>
          </div>
        </form>
      </div>
      <Link className="back-to-home-page" to="/">
        Back to Home Page
      </Link>
      <div className="coins-by-category-div ">
        {searchResult ? (
          coins.map((coin) => {
            return (
              <div className={"coin-by-category"} key={coin.id}>
                <img src={coin.observeLink} alt={coin.coinName} />
                <div className="category-coin-texts">
                  <h3 className="coin-name-h3">
                    <Link className="coin-name-h3 " to={"/coin/" + coin.id}>
                      {coin.coinName}
                    </Link>
                  </h3>
                  <p>{coin.shortDesc}</p>
                </div>
              </div>
            );
          })
        ) : (
          <h3>
            Unfortunately, we were unable to find any information that matches
            your search criteria. Please modify your search and try again.
          </h3>
        )}
      </div>
    </div>
  );
}
