import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import "./CoinDescription.css";
export default function CoinDescription() {
  const { id } = useParams();
  const [coin, setCoin] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:5000/coin/${id}`, {
      headers: {
        "api-key": "Elvin1234",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setCoin(data);
      });
  }, [id]);

  return (
    <div className="coin-list">
      {coin.map((coin) => {
        return (
          <div className="description-page" key={coin.id}>
            <div className="coin-images">
              <img src={coin.observeLink} alt={coin.name + "-front"} />
              <img src={coin.reverseLink} alt={coin.name + "-back"} />
            </div>
            <div className="coin-description">
              <h1>{coin.coinName}</h1>
              {coin.longDesc.split("\n").map((paragraph, index) => {
                return <p key={index}>{paragraph}</p>;
              })}
              <table>
                <tbody>
                  <tr>
                    <td>Issuing Country</td>
                    <td>{coin.country}</td>
                  </tr>
                  <tr>
                    <td>Composition</td>
                    <td>{coin.metal}</td>
                  </tr>
                  <tr>
                    <td>Quality</td>
                    <td>{coin.quality}</td>
                  </tr>
                  <tr>
                    <td>Denomination</td>
                    <td>{coin.denomination}</td>
                  </tr>
                  <tr>
                    <td>Year</td>
                    <td>{coin.year}</td>
                  </tr>
                  <tr>
                    <td>Weight</td>
                    <td>{coin.weight}</td>
                  </tr>
                  <tr>
                    <td>Price</td>
                    <td>{coin.price}</td>
                  </tr>
                </tbody>
              </table>
              <Link
                className="back-to-list"
                to={".."}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(-1);
                }}
              >
                To the previous page
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}
