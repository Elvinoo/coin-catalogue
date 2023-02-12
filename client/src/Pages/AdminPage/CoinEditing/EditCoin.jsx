import React, { useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

import "./EditCoin.css";

export default function EditCoin() {
  const { id } = useParams();
  const [coin, setCoin] = useState([]);
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setCoin({ ...coin, [name]: value });
  };
  const submitHandler = async (e) => {
    e.preventDefault();
    await fetch(`http://localhost:5000/editCoin/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", "api-key": "Elvin1234" },
      body: JSON.stringify(coin),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.successfull) {
          alert("Succesfully saved");
          navigate(`/coin/` + id);
        } else {
          alert("Something went wrong. Check all the values");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (!token) {
      navigate("/admin-panel/login");
    }
    fetch(`http://localhost:5000/coin/${id}`, {
      headers: {
        "api-key": "Elvin1234",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (coin.length === 0) {
          setCoin(data[0]);
        }
      });
  }, [id, coin, navigate]);

  return (
    <div className="admin-panel-container">
      <h1 className="home-page-header">Admin Panel</h1>
      <form
        onSubmit={submitHandler}
        className="admin-panel-main"
        id="add-coin-form"
      >
        <section className="first column">
          <label className="admin-panel-label" htmlFor="coin-name">
            Coin name
          </label>
          <input
            type="text"
            name="coinName"
            id="coin-name"
            value={coin.coinName}
            onChange={handleChange}
            required
          />

          <label className="admin-panel-label" htmlFor="face-value">
            Face value
          </label>
          <input
            type="text"
            name="denomination"
            id="face-value"
            value={coin.denomination}
            onChange={handleChange}
            required
          />

          <label className="admin-panel-label" htmlFor="year">
            Year of issue
          </label>
          <input
            type="text"
            name="year"
            id="year"
            value={coin.year}
            onChange={handleChange}
            required
          />

          <label className="admin-panel-label" htmlFor="price">
            Price
          </label>
          <input
            type="text"
            name="price"
            id="price"
            value={coin.price}
            onChange={handleChange}
            required
          />

          <label className="admin-panel-label" htmlFor="country">
            Country
          </label>
          <input
            type="text"
            name="country"
            id="country"
            value={coin.country}
            onChange={handleChange}
            required
          />

          <label className="admin-panel-label" htmlFor="metal">
            Metal
          </label>
          <input
            type="text"
            name="metal"
            id="metal"
            value={coin.metal}
            onChange={handleChange}
            required
          />
        </section>

        <section className="second-column">
          <label className="admin-panel-label" htmlFor="short-description">
            Short description
          </label>
          <textarea
            name="shortDesc"
            id="short-description"
            value={coin.shortDesc}
            onChange={handleChange}
            required
          ></textarea>

          <label className="admin-panel-label" htmlFor="long-description">
            Long description
          </label>
          <textarea
            name="longDesc"
            id="long-description"
            value={coin.longDesc}
            onChange={handleChange}
            required
          ></textarea>

          <label className="admin-panel-label" htmlFor="quality">
            Quality of the coin
          </label>
          <input
            type="text"
            name="quality"
            id="quality"
            value={coin.quality}
            onChange={handleChange}
            required
          />

          <label className="admin-panel-label" htmlFor="weight">
            Weight
          </label>
          <input
            type="text"
            name="weight"
            id="weight"
            value={coin.weight}
            onChange={handleChange}
            required
          />
        </section>
        <section className="third-column">
          <label className="admin-panel-label" htmlFor="observe-link">
            Link to obverse image
          </label>
          <input
            type="text"
            name="observeLink"
            id="observe-link"
            value={coin.observeLink}
            onChange={handleChange}
            required
          />

          <label className="admin-panel-label" htmlFor="reverse-link">
            Link to reverse image
          </label>
          <input
            type="text"
            name="reverseLink"
            id="reverse-link"
            value={coin.reverseLink}
            onChange={handleChange}
            required
          />

          <label className="admin-panel-label" htmlFor="category">
            Category
          </label>
          <input
            type="text"
            name="category"
            id="category"
            value={coin.category}
            onChange={handleChange}
            required
          />

          <div className="buttons">
            <button type="submit">Save</button>

            <button
              onClick={(e) => {
                e.preventDefault();
                navigate("/admin-panel/editCoin");
              }}
              type="button"
            >
              Cancel
            </button>
          </div>
        </section>
      </form>
    </div>
  );
}
