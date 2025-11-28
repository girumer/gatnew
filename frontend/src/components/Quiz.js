import React, { useEffect, useState } from 'react';
import Questions from './Questions';
import { useParams } from 'react-router-dom';
import './Quiz.css';
import { moveNextquestion, movePrevquestion } from '../hooks/fetchQestion';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { PushAnswer } from '../hooks/setResult';
import { moveNextquestion } from '../hooks/fetchQestion';
function Quiz() {
    const { title } = useParams();
    const dispatch = useDispatch();
    
    // Redux State
    const { queue, trace } = useSelector(state => state.questions);
    const result = useSelector(state => state.result.result);

    // Local State
    const savedPage = localStorage.getItem("currentPage");
    const [currentPage, setCurrentPage] = useState(savedPage ? Number(savedPage) : 0);
    const [restored, setRestored] = useState(false); // ✅ Crucial Flag
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

    // ---------------------------------------------------------
    // 1. RESTORATION EFFECT (The Fix for Refresh)
    // ---------------------------------------------------------
useEffect(() => {
    if (!queue.length) return;
    if (restored) return;

    const savedTitle = localStorage.getItem("examTitle");
    
    // Logic to handle new exams (as discussed previously)
    if (savedTitle !== title) {
        setRestored(true); 
        return;
    }

    const savedTrace = localStorage.getItem("trace");
    const savedMode = localStorage.getItem("mode");
    const savedPopup = localStorage.getItem("showPopup");

    if (savedTrace !== null) {
        const traceNum = Number(savedTrace);
        
        // ✅ Use the correct Redux Toolkit action creator!
        dispatch(moveToQuestionAction(traceNum)); 

        setCurrentPage(Math.floor(traceNum / buttonsPerPage));
    }

    if (savedMode) setMode(savedMode);
    if (savedPopup !== null) setShowPopup(JSON.parse(savedPopup));

    setRestored(true); 
}, [queue.length, title, restored, dispatch, buttonsPerPage]);

    // ---------------------------------------------------------
    // 2. SAVE EFFECT (Guarded by 'restored')
    // ---------------------------------------------------------
    useEffect(() => {
        // ✅ Only save if we have finished restoring
        if (restored) {
            localStorage.setItem("trace", trace);
        }
    }, [trace, restored]);

    // ---------------------------------------------------------
    // Other Side Effects
    // ---------------------------------------------------------
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
        localStorage.setItem("examTitle", title);
    }, [title]);

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
                dispatch(PushAnswer(cheak));
            }
        }
        setCheack(undefined);
    }

    // ---------------------------------------------------------
    // Render Logic
    // ---------------------------------------------------------
    if (result.length && result.length >= queue.length) {
        return <Navigate to={'/result'} replace={true}></Navigate>;
    }

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

            <Questions onCheak={onCheak} title={title} mode={mode} />

            <div className="grid">
                {trace > 0 ? <button className="btn prev" onClick={onPrev}>Prev</button> : <div></div>}
                <button className="btn next" onClick={onNext}>Next</button>
            </div>
        </div>
    );
}

export default Quiz;