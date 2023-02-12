import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import arrow2 from "../../arrow.svg";
import "./HomePageCoins.css";
export default function HomePageCoins() {
  const [coins, setCoins] = useState([]);
  useEffect(() => {
    fetch("http://localhost:5000/", {
      headers: {
        "api-key": "Elvin1234",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (coins.length === 0) {
          setCoins(data);
        }
      });
  }, [coins]);
  return (
    <div className="home-page-coins">
      {coins.map((coin) => {
        return (
          <div className="home-page-coin" key={coin.id}>
            <h3>{coin.category}</h3>
            <Link
              className="show-all-link"
              to={"/coins/" + coin.category.toLowerCase().split(" ")[0]}
            >
              Show all <img className="arrow" src={arrow2} alt="arrow" />
            </Link>
            <img src={coin.observeLink} alt={coin.coinName} />
          </div>
        );
      })}
    </div>
  );
}
