import React, { useEffect, useState } from "react";
import './useresult.css';

function UserResults({ phone }) {
  const [results, setResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const rowsPerPage = 5;
const [deposits, setDeposits] = useState([]);
  useEffect(() => {
    if (!phone) return;

    fetch(`${process.env.REACT_APP_BACKENDURL}/api/result?phone=${encodeURIComponent(phone)}`)
      .then(res => res.json())
      .then(data => setResults(data.results || []))
      .catch(err => console.error("Fetch error:", err));
  }, [phone]);

  // Slice results for current page
  const paginatedResults = results.slice(
    currentPage * rowsPerPage,
    (currentPage + 1) * rowsPerPage
  );

  return (
    <div className="user-results">
      <h2>Your Exam History</h2>

      {results.length === 0 ? (
        <p>No results found.</p>
      ) : (
        <>
          <table className="results-table">
            <thead className="results-head">
              <tr>
                <th>Exam</th>
                <th>Year</th>
                <th>Part</th>
                <th>Points</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {paginatedResults.map((r, i) => (
                <tr key={i}>
                  <td>{r.exam}</td>
                  <td>{r.year}</td>
                  <td>{r.part}</td>
                  <td>{r.points}</td>
                  <td
                    className={`status ${
                      r.achived === "passed" ? "status-passed" : "status-failed"
                    }`}
                  >
                    {r.achived}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination controls */}
          <div className="pagination-buttons">
            {Array.from({ length: Math.ceil(results.length / rowsPerPage) }).map((_, index) => (
              <button
                key={index}
                className={`pagination-btn ${index === currentPage ? 'active' : ''}`}
                onClick={() => setCurrentPage(index)}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default UserResults;
