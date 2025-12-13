import React, { useEffect, useState } from 'react';
import './Questions.css';

import { useFetchQustion } from '../hooks/fetchQestion';
import { useSelector, useDispatch } from 'react-redux';
import { updateResultAction } from '../redux/result_reducer';
import { updateResult } from '../hooks/setResult'; // Not used in provided code, but kept for completeness

function Questions({ onCheak, title, mode }) {

    // --- Redux State and Data Fetching ---
    
    // Custom hook to fetch questions
    const [{ isLoading, apiData, serverError }] = useFetchQustion(title);
    
    // Question Queue/Trace and Answers from Redux
    const { trace, answers } = useSelector(state => state.questions);
    const result = useSelector(state => state.result.result);
    
    const dispatch = useDispatch();
    
    // Current question object and relevant answer indices
    const question = useSelector(state => state.questions.queue[state.questions.trace]);
    const userSelected = result[trace];
    const correctAnswer = answers[trace];
    
    // --- Local State and Effects ---
    
    const [cheaked, setCheack] = useState(undefined);

    // Logging the current question when it changes
    useEffect(() => {
        console.log(question);
    }, [question]);
    
    // Resetting local 'cheaked' state when moving to a new question (trace changes)
    useEffect(() => {
        setCheack(undefined);
    }, [trace]);

    // Security effect: Disable right-click and Ctrl+C/Ctrl+X
    useEffect(() => {
        const handleContextMenu = (e) => e.preventDefault();
        document.addEventListener("contextmenu", handleContextMenu);

        const handleKeyDown = (e) => {
            if (e.ctrlKey && (e.key === "c" || e.key === "x")) {
                e.preventDefault();
            }
        };
        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("contextmenu", handleContextMenu);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    // Function to handle option selection
    function onSelect(i) {
        onCheak(i);
        setCheack(i);
        dispatch(updateResultAction({ checked: i, trace }));
    }

    // --- Loading and Error Handling ---
    
    if (isLoading) {
        return <h2 className='text-light'>Loading...</h2>;
    }

    if (serverError) {
        return <h2 className='text-light'>{serverError.message || "unknown error"}</h2>;
    }

    if (!question) {
        return <h2 className='text-light'>No question found</h2>;
    }

    // --- Component Render ---

    return (
        <div className='questions'>
            <div className="watermark">Exam: {title}</div>
            <h2 className='text-light'>{question?.question}</h2>

            {/* Question Image Rendering */}
            {question?.image && (
                <div>
                    <img
                        src={question.image.replace("http://", "https://")}
                        alt="question"
                        style={{ maxWidth: '100%', marginBottom: '1rem' }}
                        onLoad={() => console.log('Image loaded successfully:', question.image)}
                        onError={(e) => console.error('Image failed to load with source:', e.target.src)}
                    />
                </div>
            )}
            
            {/* Options List Rendering */}
            <ul key={question?.id}>
                {Array.isArray(question?.options) ? (
                    question.options.map((q, i) => {
                        
                        // --- 🌟 COLORING LOGIC FOR STUDY AND REVIEW MODES ---
                        let highlightClass = '';

                        if (mode === 'study' && cheaked !== undefined) {
                            // STUDY MODE: Highlight user's CURRENT selected option as correct/wrong
                            if (i === cheaked) {
                                highlightClass = i === correctAnswer ? 'correct' : 'wrong';
                            }
                        } 
                        else if (mode === 'review') {
                            // REVIEW MODE: 
                            // 1. Highlight the CORRECT answer in green (always)
                            if (i === correctAnswer) {
                                highlightClass = 'correct'; 
                            } 
                            // 2. Highlight the user's WRONG answer in red 
                            else if (i === userSelected && i !== correctAnswer) {
                                highlightClass = 'wrong'; 
                            }
                        }

                        return (
                            <li key={i}>
                                <input 
                                    type="radio"
                                    value={q}
                                    name={`question-${trace}`} 
                                    id={`q${i}-options`}
                                    // Set 'checked' to the user's saved answer in the result array
                                    checked={i === userSelected}
                                    // Disable input in review mode
                                    disabled={mode === 'review'}
                                    onChange={() => onSelect(i)}
                                />

                                {/* Checkmark indicator */}
                                <div className={`check ${userSelected === i ? 'checked' : ''}`}></div>
                                
                                {/* Option Label with Dynamic Coloring */}
                                <label
                                    className={`text-primary ${highlightClass}`}
                                    htmlFor={`q${i}-options`}
                                >
                                    {q}
                                </label>
                            </li>
                        );
                    })
                ) : (
                    <li className="text-light">No options available</li>
                )}
            </ul>
            
            {/* --- 🌟 EXPLANATION RENDERING FOR STUDY AND REVIEW MODES --- */}
            {((mode === 'study' && cheaked !== undefined) || mode === 'review') && 
             (question.explanation || question.explanationImage) && (
                <div className="explanation-box">
                    <h3 className="text-light">Explanation</h3>
                    
                    {/* Render the text explanation */}
                    {question.explanation && (
                        <p className="text-light">{question.explanation}</p>
                    )}

                    {/* Render the explanation image */}
                    {question.explanationImage && (
                        <div style={{ marginTop: '1rem' }}>
                            <img
                                src={question.explanationImage.replace("http://", "https://")}
                                alt="Explanation Diagram"
                                style={{ maxWidth: '100%', border: '1px solid #333' }}
                                onLoad={() => console.log('Explanation image loaded successfully:', question.explanationImage)}
                                onError={(e) => console.error('Explanation image failed to load with source:', e.target.src)}
                            />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default Questions;