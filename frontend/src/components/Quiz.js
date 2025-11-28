import React, { useEffect, useState } from 'react';
import Questions from './Questions';
import { useParams, Navigate } from 'react-router-dom';
import './Quiz.css';
import { moveNextquestion, movePrevquestion } from '../hooks/fetchQestion';
import { useSelector, useDispatch } from 'react-redux';
import { PushAnswer } from '../hooks/setResult';

function Quiz() {
  const savedPage = localStorage.getItem("currentPage");
  const [currentPage, setCurrentPage] = useState(savedPage ? Number(savedPage) : 0);
  const [restored, setRestored] = useState(false);

  const buttonsPerPage = 5;
  const savedMode = localStorage.getItem("mode");
  const savedPopup = localStorage.getItem("showPopup");
  const [showPopup, setShowPopup] = useState(
    savedPopup !== null ? JSON.parse(savedPopup) : true
  );

  const savedTime = localStorage.getItem("timeLeft");
  const [mode, setMode] = useState(savedMode || null);
  const [timeLeft, setTimeLeft] = useState(savedTime ? Number(savedTime) : 100 * 60);

  const { title } = useParams();
  const [check, setCheck] = useState(undefined);
  const dispatch = useDispatch();
  const { queue, trace } = useSelector(state => state.questions);
  const result = useSelector(state => state.result.result);

  // Restore state from localStorage
  useEffect(() => {
    if (!queue.length) return;
    if (restored) return;

    const savedTitle = localStorage.getItem("examTitle");
    if (savedTitle !== title) return;

    const savedTrace = localStorage.getItem("trace");
    const savedMode = localStorage.getItem("mode");
    const savedPopup = localStorage.getItem("showPopup");

    if (savedTrace !== null) {
      const traceNum = Number(savedTrace);
      dispatch({ type: "MOVE_TO_QUESTION", payload: traceNum });
      setCurrentPage(Math.floor(traceNum / buttonsPerPage)); // ✅ restore page
    }

    if (savedMode) setMode(savedMode);
    if (savedPopup !== null) setShowPopup(JSON.parse(savedPopup));

    setRestored(true);
  }, [queue.length, title, restored, dispatch, buttonsPerPage]);

  // Persist values
  useEffect(() => { localStorage.setItem("trace", trace); }, [trace]);
  useEffect(() => { localStorage.setItem("mode", mode); }, [mode]);
  useEffect(() => { localStorage.setItem("showPopup", JSON.stringify(showPopup)); }, [showPopup]);
  useEffect(() => { localStorage.setItem("timeLeft", timeLeft); }, [timeLeft]);
  useEffect(() => { localStorage.setItem("examTitle", title); }, [title]);
  useEffect(() => { localStorage.setItem("currentPage", currentPage); }, [currentPage]);

  // Timer
  useEffect(() => {
    if (mode !== 'exam') return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [mode]);

  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  function onCheck(i) { setCheck(i); }

  function onPrev() {
    if (trace > 0) dispatch(movePrevquestion());
  }

  function onNext() {
    if (trace < queue.length) {
      dispatch(moveNextquestion());
      if (result.length <= trace) {
        dispatch(PushAnswer(check));
      }
    }
    setCheck(undefined);
  }

  // Redirect if finished
  if (result.length && result.length >= queue.length) {
    return <Navigate to="/result" replace />;
  }

  // Mode popup
  if (showPopup) {
    return (
      <div className="vindimate-container1">
        <button className="vindimate-box1 part-one1" onClick={() => {
          setMode('exam');
          setShowPopup(false);
          setTimeLeft(100 * 60);
          localStorage.setItem("timeLeft", 100 * 60);
        }}>Exam Mode</button>
        <button className="vindimate-box1 part-two1" onClick={() => {
          setMode('study');
          setShowPopup(false);
        }}>Study Mode</button>
      </div>
    );
  }
if (!restored) {
    return <h2 className="text-light">Restoring progress...</h2>;
  }
  return (
    <div className="container">
      <div className='timer'>
        <h1 className="title text-light">Quiz Application</h1>
        {mode === 'exam' && (
          <div className="timer">
            <h3 className="text-timer">Time Left: {formatTime(timeLeft)}</h3>
          </div>
        )}
      </div>

      <div className="pagination-buttons">
        {queue
          .slice(currentPage * buttonsPerPage, (currentPage + 1) * buttonsPerPage)
          .map((_, index) => {
            const actualIndex = currentPage * buttonsPerPage + index;
            return (
              <button
                key={actualIndex}
                className={`pagination-btn ${actualIndex === trace ? 'active' : ''}`}
                onClick={() => dispatch({ type: 'MOVE_TO_QUESTION', payload: actualIndex })}
              >
                {actualIndex + 1}
              </button>
            );
          })}
      </div>

      <Questions onCheak={onCheck} title={title} mode={mode} />

      <div className="grid">
        {trace > 0 ? <button className="btn prev" onClick={onPrev}>Prev</button> : <div></div>}
        <button className="btn next" onClick={onNext}>Next</button>
      </div>
    </div>
  );
}

export default Quiz;
