import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import HomePageCoins from "../../../Components/HomePageCoins/HomePageCoins";

import arrow from "../../../arrow.svg";
import "./HomePage.css";
export default function HomePage() {
  const [value, setValue] = useState("");
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    if (value !== "") {
      navigate(`/search?q=${value.toLowerCase()}`);
    }
  };
  return (
    <>
      <h1 className="home-page-header">Homepage</h1>
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
      <Link className="adv-link" to="/adv-search">
        Advanced filter <img className="arrow" src={arrow} alt="arrow" />
      </Link>
      <HomePageCoins />
    </>
  );
}
