import React, { useEffect, useState } from 'react';   // <-- add useState here
import '../styles/Result.css';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { atempts_Number, earn_pointNumber, flagresult } from '../helper/helper';
import { resetAllAction } from '../redux/question_reducer';
import { resetResultAction } from '../redux/result_reducer';
import { usePublishResult } from '../hooks/setResult';
import UserResults from './UserResults';

function Result() {
  const dispatch = useDispatch();
  const { questions: { queue, answers }, result: { result } } = useSelector(state => state);

  const { search } = useLocation();
  const params = new URLSearchParams(search);

  // ✅ Read values from Telegram URL
  const phoneFromTG = params.get("phone");
  const usernameFromTG = params.get("username");

  // ✅ Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const rowsPerPage = 5;

  // ✅ Always overwrite localStorage when opened from Telegram
  useEffect(() => {
    if (phoneFromTG) localStorage.setItem("phone", phoneFromTG);
    if (usernameFromTG) localStorage.setItem("username", usernameFromTG);
  }, [phoneFromTG, usernameFromTG]);

  // ✅ Slice results for pagination
  const paginatedResults = result.slice(
    currentPage * rowsPerPage,
    (currentPage + 1) * rowsPerPage
  );

  // ✅ Read final values
  const username = localStorage.getItem("username");
  const phoneNumber = localStorage.getItem("phone");

  // ✅ Read examPath BEFORE conditional return
  const examPath = localStorage.getItem("examPath");

  let exam = null, year = null, part = null;
  if (examPath) {
    exam = examPath.slice(0, 4);
    year = examPath.slice(4, 8);
    part = examPath.slice(8);
  }

  const totalpoints = queue.length;
  const atempts = atempts_Number(result);
  const earnpoints = earn_pointNumber(result, answers, 1);
  const flag = flagresult(totalpoints, earnpoints);

  usePublishResult({
    username,
    phoneNumber,
    result,
    attempts: atempts,
    points: earnpoints,
    achived: flag ? "passed" : "failed",
    exam,
    year,
    part
  });

  if (!examPath) {
    return <div style={{ color: "red" }}>No exam selected.</div>;
  }

  function onRestart() {
    dispatch(resetAllAction());
    dispatch(resetResultAction());
  }

  return (
    <div className="container">
      {/* Show summary box only if quiz finished AND not opened via Telegram */}
      {result.length >= queue.length && !phoneFromTG && !usernameFromTG && (
        <div className="result-box">
          <h2>Exam Summary</h2>
          <p><strong>Exam:</strong> {exam}</p>
          <p><strong>Year:</strong> {year}</p>
          <p><strong>Part:</strong> {part}</p>
          <p><strong>Username:</strong> {username}</p>
          <p><strong>Phone:</strong> {phoneNumber}</p>
          <p><strong>Attempts:</strong> {atempts}</p>
          <p><strong>Points:</strong> {earnpoints} / {totalpoints}</p>
          <p className={flag ? 'passed' : 'failed'}>
            <strong>Status:</strong> {flag ? 'Passed ✅' : 'Failed ❌'}
          </p>
        </div>
      )}

      {/* Always show the table with pagination */}
      <UserResults phone={phoneNumber} results={paginatedResults} />

      <div className="pagination-buttons">
        {Array.from({ length: Math.ceil(result.length / rowsPerPage) }).map((_, index) => (
          <button
            key={index}
            className={`pagination-btn ${index === currentPage ? 'active' : ''}`}
            onClick={() => setCurrentPage(index)}
          >
            {index + 1}
          </button>
        ))}
      </div>

      <div className="restart">
        <Link to="/" onClick={onRestart} className="btn">
          Restart Quiz
        </Link>
      </div>
    </div>
  );
}

export default Result;
