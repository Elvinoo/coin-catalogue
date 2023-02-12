import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { useLocation, useNavigate } from "react-router-dom";

export default function Pagination({ data, itemsPerPage }) {
  const [coins, setCoins] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    const endOffset = itemOffset + itemsPerPage;
    setCoins(data.slice(itemOffset, endOffset));
    setPageCount(Math.ceil(data.length / itemsPerPage));
  }, [itemOffset, itemsPerPage, data]); //eslint-disable-line react-hooks/exhaustive-deps

  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % data.length;
    setItemOffset(newOffset);
    navigate(`/admin-panel/editCoin/?pageNum=` + (event.selected + 1));
  };

  return (
    <>
      <div className="home-page-coins">
        {coins.map((coin) => {
          return (
            <div className="edit-coin" key={coin.id}>
              <img src={coin.observeLink} alt={coin.coinName} />
              <div className="edit-coin-texts">
                <h3 className="edit-page-h3">{coin.coinName}</h3>
                <p>{coin.shortDesc}</p>
              </div>
              <button
                onClick={() => navigate(location.pathname + "/" + coin.id)}
              >
                Edit
              </button>
              <button
                className="delete-coin"
                onClick={() => {
                  if (
                    window.confirm("Are you sure you want to delete this coin?")
                  ) {
                    fetch(`http://localhost:5000/delete/${coin.id}`, {
                      headers: {
                        "api-key": "Elvin1234",
                      },

                      method: "DELETE",
                    })
                      .then((response) => response.json())
                      .then((data) => {
                        if (data) {
                          alert(`${coin.coinName} has been DELETED!!!`);
                        }
                      });
                  }
                }}
              >
                Delete
              </button>
            </div>
          );
        })}
      </div>
      <div className="my-react-pagination">
        <ReactPaginate
          nextLabel="next >"
          onPageChange={handlePageClick}
          pageRangeDisplayed={3}
          marginPagesDisplayed={2}
          pageCount={pageCount}
          previousLabel="< previous"
          pageClassName="page-item"
          pageLinkClassName="page-link"
          previousClassName="page-item"
          previousLinkClassName="page-link"
          nextClassName="page-item"
          nextLinkClassName="page-link"
          breakLabel="..."
          breakClassName="page-item"
          breakLinkClassName="page-link"
          containerClassName="pagination"
          activeClassName="active"
          renderOnZeroPageCount={null}
        />
      </div>
    </>
  );
}
