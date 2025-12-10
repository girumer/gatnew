import React, { useEffect, useState } from "react";
import './useresult.css';

function UserResults({ phone }) {
  const [results, setResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const rowsPerPage = 5;

  useEffect(() => {
    if (!phone) return;

    fetch(`${process.env.REACT_APP_BACKENDURL}/api/result?phone=${phone}`)
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
                  <td data-label="Exam">{r.exam}</td> {/* ADD data-label */}
                  <td data-label="Year">{r.year}</td> {/* ADD data-label */}
                  <td data-label="Part">{r.part}</td> {/* ADD data-label */}
                  <td data-label="Points">{r.points}</td> {/* ADD data-label */}
                  <td
                    className={`status ${
                      r.achived === "passed" ? "status-passed" : "status-failed"
                    }`}
                    data-label="Status" // ADD data-label
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
