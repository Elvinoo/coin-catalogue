import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminPanelAdd.css";

export default function AdminPanelAdd() {
  const resetValues = {
    category: "",
    coinName: "",
    country: "",
    denomination: "",
    longDesc: "",
    metal: "",
    observeLink: "",
    price: "",
    quality: "",
    reverseLink: "",
    shortDesc: "",
    weight: "",
    year: "",
  };

  const navigate = useNavigate();
  const [formData, setFormData] = useState({});
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };
  const submitHandler = async (e) => {
    e.preventDefault();
    await fetch("http://localhost:5000/addCoin", {
      method: "POST",
      headers: { "Content-Type": "application/json", "api-key": "Elvin1234" },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.successfull) {
          alert("Succesfully saved");
          setFormData(resetValues);
        } else {
          alert("Fill all the fields");
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
  });
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
            value={formData.coinName}
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
            value={formData.denomination}
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
            value={formData.year}
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
            value={formData.price}
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
            value={formData.country}
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
            value={formData.metal}
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
            value={formData.shortDesc}
            onChange={handleChange}
            required
          ></textarea>

          <label className="admin-panel-label" htmlFor="long-description">
            Long description
          </label>
          <textarea
            name="longDesc"
            id="long-description"
            value={formData.longDesc}
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
            value={formData.quality}
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
            value={formData.weight}
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
            value={formData.observeLink}
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
            value={formData.reverseLink}
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
            value={formData.category}
            onChange={handleChange}
            required
          />

          <div className="buttons">
            <button type="submit">Save</button>

            <button
              onClick={(e) => {
                e.preventDefault();
                navigate(-1);
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
