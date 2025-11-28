import React, { useEffect, useState } from "react";
import './useresult.css';
function UserResults({ phone }) {
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (!phone) return;

    fetch(`${process.env.REACT_APP_BACKENDURL}/api/result?phone=${phone}`)
      .then(res => res.json())
      .then(data => setResults(data.results || []))
      .catch(err => console.error("Fetch error:", err));
  }, [phone]);

  return (
    <div className="user-results">
      <h2>Your Exam History</h2>

      {results.length === 0 ? (
        <p>No results found.</p>
      ) : (
        <table className="results-table">
          <thead className="results-head">
            <tr>
              <th>Exam</th>
              <th>Year</th>
              <th>Part</th>
              <th>Points</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {results.map((r, i) => (
              <tr key={i}>
                <td>{r.exam}</td>
                <td>{r.year}</td>
                <td>{r.part}</td>
                <td>{r.points}</td>
                <td className={`status ${r.achived === "passed" ? "status-passed" : "status-failed"}`}>
                 {r.achived}
                    </td>

              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default UserResults;

               /*--  <th>Attempts</th><td>{new Date(r.createdAt).toLocaleString()}</td>--*/