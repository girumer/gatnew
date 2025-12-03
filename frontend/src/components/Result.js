import React, { useEffect } from 'react'
import '../styles/Result.css';
import { Link } from 'react-router-dom';
import ResultTable from './ResultTable';
import { useDispatch, useSelector } from 'react-redux';
import { atempts_Number,earn_pointNumber,flagresult } from '../helper/helper';
import { resetAllAction } from '../redux/question_reducer';
import { resetResultAction } from '../redux/result_reducer';
import { usePublishResult } from '../hooks/setResult';
import { useLocation } from 'react-router-dom';
import UserResults from './UserResults';
function Result() {
  const dispatch = useDispatch();
  const { questions: { queue, answers }, result: { result } } = useSelector(state => state);

  const { search } = useLocation();
  const params = new URLSearchParams(search);

  // ✅ Read values from Telegram URL
  const phoneFromTG = params.get("phone");
  const usernameFromTG = params.get("username");

  // ✅ Always overwrite localStorage when opened from Telegram
  useEffect(() => {
    if (phoneFromTG) localStorage.setItem("phone", phoneFromTG);
    if (usernameFromTG) localStorage.setItem("username", usernameFromTG);
  }, [phoneFromTG, usernameFromTG]);

  // ✅ Read final values
  const username = localStorage.getItem("username");
  const phoneNumber = localStorage.getItem("phone");

  // ✅ Read examPath BEFORE conditional return
  const examPath = localStorage.getItem("examPath");

  // ✅ SAFE: compute exam values only if examPath exists
  let exam = null, year = null, part = null;
  if (examPath) {
    exam = examPath.slice(0, 4);
    year = examPath.slice(4, 8);
    part = examPath.slice(8);
  }

  // ✅ Calculate results (hooks must be above conditional return)
  const totalpoints = queue.length;
  const atempts = atempts_Number(result);
  const earnpoints = earn_pointNumber(result, answers, 1);
  const flag = flagresult(totalpoints, earnpoints);

  // ✅ ✅ Hook MUST be called unconditionally
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

  // ✅ Conditional return AFTER all hooks
  if (!examPath) {
    return <div style={{ color: "red" }}>No exam selected.</div>;
  }

  function onRestart() {
    dispatch(resetAllAction());
    dispatch(resetResultAction());
  }

  return (
  <div className="container">
    {result.length >= queue.length  (
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

        {/* Table inside the same box */}
        <div className="result-table-wrapper">
          <UserResults phone={phoneNumber} />
        </div>
      </div>
    )}

    {/* Table only (when quiz not finished) */}
    {result.length < queue.length && earnpoints===0 (
   <UserResults phone={phoneNumber} />
    )}

    <UserResults phone={phoneNumber} />

    <div className="restart">
      <Link to="/" onClick={onRestart} className="btn">
        Restart Quiz
      </Link>
    </div>
  </div>
);
}


export default Result;
