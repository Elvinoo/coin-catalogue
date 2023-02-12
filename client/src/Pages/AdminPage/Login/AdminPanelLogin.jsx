import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminPanelLogin.css";
export default function AdminPanelLogin() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("http://localhost:5000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": "Elvin1234",
      },
      body: JSON.stringify({ userName, password }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.error) {
          setError(data.error);
        } else {
          localStorage.setItem("jwt", data.token);
          setError("Logged in");
          navigate("/admin-panel/editCoin");
        }
      })
      .catch((error) => {
        setError(error.message);
      });
  };
  return (
    <>
      <h1 className="home-page-header">Admin Panel</h1>
      <form className="login-form" action="submit" onSubmit={handleSubmit}>
        <div className="login-input">
          <label htmlFor="login-input" className="label">
            Login
          </label>
          <input
            type="text"
            name="login"
            id="login-input"
            placeholder="Username"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
        </div>
        <div className="password">
          <label htmlFor="password" className="label">
            Password
          </label>
          <input
            className="password-input"
            type="password"
            name="password"
            id="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button className="sign-in-button">Sign in</button>
        {error && <div style={{ color: "red" }}>{error}</div>}
      </form>
    </>
  );
}
