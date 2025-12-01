import React, { useEffect, useState } from 'react';
import Questions from './Questions';
import { useParams, Navigate } from 'react-router-dom';
import './Quiz.css';
import { moveNextquestion, movePrevquestion } from '../hooks/fetchQestion';
import { useSelector, useDispatch } from 'react-redux';
import { moveToQuestionAction } from '../redux/question_reducer';
import { pushResultAction } from '../redux/result_reducer';

function Quiz() {
  const { title } = useParams();
  const dispatch = useDispatch();

  // Redux State
  const { queue, trace } = useSelector(state => state.questions);
  const result = useSelector(state => state.result.result);

  // Local State
  const savedPage = localStorage.getItem("currentPage");
  const [currentPage, setCurrentPage] = useState(savedPage ? Number(savedPage) : 0);
  const [restored, setRestored] = useState(false);
  const buttonsPerPage = 5;

  // Mode & Popup State
  const savedMode = localStorage.getItem("mode");
  const savedPopup = localStorage.getItem("showPopup");
  const [showPopup, setShowPopup] = useState(savedPopup !== null ? JSON.parse(savedPopup) : true);
  const [mode, setMode] = useState(savedMode || null);

  // Timer State
  const savedTime = localStorage.getItem("timeLeft");
  const [timeLeft, setTimeLeft] = useState(savedTime ? Number(savedTime) : 100 * 60);

  const [cheak, setCheack] = useState(undefined);
  const [examPath, setExamPath] = useState(title);

  // ---------------------------------------------------------
  // 1. RESTORATION EFFECT
  // ---------------------------------------------------------
  useEffect(() => {
    if (!queue.length) return;
    if (restored) return;

    const savedTitle = localStorage.getItem("examTitle");
    if (savedTitle !== examPath) {
      setRestored(true);
      return;
    }

    const savedTrace = localStorage.getItem("trace");
    const savedMode = localStorage.getItem("mode");
    const savedPopup = localStorage.getItem("showPopup");

    if (savedTrace !== null) {
      const traceNum = Number(savedTrace);
      dispatch(moveToQuestionAction(traceNum));
      setCurrentPage(Math.floor(traceNum / buttonsPerPage));
    }

    if (savedMode) setMode(savedMode);
    if (savedPopup !== null) setShowPopup(JSON.parse(savedPopup));

    setRestored(true);
  }, [queue.length, examPath, restored, dispatch, buttonsPerPage]);

  // ---------------------------------------------------------
  // 2. SAVE EFFECTS
  // ---------------------------------------------------------
  useEffect(() => {
    if (restored) {
      localStorage.setItem("trace", trace);
    }
  }, [trace, restored]);

  // ✅ Save examTitle consistently from examPath
  useEffect(() => {
    const storedExamPath = localStorage.getItem("examPath");
    if (storedExamPath) {
      setExamPath(storedExamPath);
      localStorage.setItem("examTitle", storedExamPath);
    } else {
      localStorage.setItem("examTitle", title);
    }
  }, [title]);

  useEffect(() => {
    localStorage.setItem("mode", mode);
  }, [mode]);

  useEffect(() => {
    localStorage.setItem("showPopup", JSON.stringify(showPopup));
  }, [showPopup]);

  useEffect(() => {
    localStorage.setItem("timeLeft", timeLeft);
  }, [timeLeft]);

  useEffect(() => {
    const newPage = Math.floor(trace / buttonsPerPage);
    if (newPage !== currentPage) {
      setCurrentPage(newPage);
    }
  }, [trace, buttonsPerPage, currentPage]);

  // Timer Logic
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

  // Helper Functions
  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  function onCheak(i) {
    setCheack(i);
  }

  function onPrev() {
    if (trace > 0) {
      dispatch(movePrevquestion());
    }
  }

  function onNext() {
    if (trace < queue.length) {
      dispatch(moveNextquestion());
      if (result.length <= trace) {
        dispatch(pushResultAction(cheak));
      }
    }
    setCheack(undefined);
  }

  if (result.length && result.length >= queue.length) {
    return <Navigate to={'/result'} replace={true} />;
  }

  // ---------------------------------------------------------
  // Render Logic
  // ---------------------------------------------------------
  if (showPopup) {
    return (
      <div className="vindimate-container1">
        <button
          className="vindimate-box1 part-one1"
          onClick={() => {
            setMode('exam');
            setShowPopup(false);
            setTimeLeft(100 * 60);
            localStorage.setItem("timeLeft", 100 * 60);
          }}
        >
          <span className="mode-icon">⏱️</span>
          <span>EXAM MODE</span>
        </button>

        <button
          className="vindimate-box1 part-two1"
          onClick={() => {
            setMode('study');
            setShowPopup(false);
          }}
        >
          <span className="mode-icon">📖</span>
          <span>STUDY MODE</span>
        </button>
      </div>
    );
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
                onClick={() => dispatch(moveToQuestionAction(actualIndex))}
              >
                {actualIndex + 1}
              </button>
            );
          })}
      </div>

      {/* ✅ Pass examPath instead of raw title */}
      <Questions onCheak={onCheak} title={examPath} mode={mode} />

      <div className="grid">
        {trace > 0 ? <button className="btn prev" onClick={onPrev}>Prev</button> : <div></div>}
        <button className="btn next" onClick={onNext}>Next</button>
      </div>
    </div>
  );
}

export default Quiz;
