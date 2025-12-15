import React, { useState, useEffect } from 'react';
import './NgatPage.css';
import { Link, useLocation } from 'react-router-dom';

// Define all NGAT exam years/identifiers
const ngatAllExams = ['GAT1', 'GAT2', 'GAT3', 'GAT1SAMPLE', 'GAT2SAMPLE', 'GAT3SAMPLE'];
const ngatSampleExams = ['GAT1SAMPLE', 'GAT2SAMPLE', 'GAT3SAMPLE'];

const NgatPage = () => {
    // Get URL parameters
    const { search } = useLocation();
    const params = new URLSearchParams(search);
    const phone = params.get("phone"); 
    const username = params.get("username");
    // Check for the 'sample' query parameter
    const isSampleMode = params.get("sample") === 'true'; 

    // Determine the list of exams to show based on the 'sample' parameter
    const examsToShow = isSampleMode ? ngatSampleExams : ngatAllExams;

    // State to manage which exam identifier the user has clicked
    const [selectedExam, setSelectedExam] = useState(null);

    // Fix: Use phone1/username1 for consistency with your ERMP/Vindimate page
    useEffect(() => {
        localStorage.removeItem("phone1");
        localStorage.removeItem("username1");

        if (phone) localStorage.setItem("phone1", phone);
        if (username) localStorage.setItem("username1", username);
    }, [phone, username]);

    // Use the stored username for display
    const displayUsername = localStorage.getItem("username1") || username;

    return (
        <div className="ngat-wrapper">
            <h1>
                Welcome {displayUsername ? `User: ${displayUsername}` : 'No username passed'}
            </h1>
            
            <h1 className="ngat-title">
                {selectedExam ? `${selectedExam}` : 
                 isSampleMode ? 'NGAT SAMPLE EXAM LIST' : 'NGAT EXAM LIST'} 
            </h1>

            {!selectedExam ? (
                // --- STAGE 1: Show Exam List (GAT1, GAT2, etc. or just Samples) ---
                <div className="ngat-container">
                    {/* Use the dynamically selected examsToShow array */}
                    {examsToShow.map((exam, index) => (
                        <div
                            key={index}
                            className="ngat-box"
                            // Set the selected exam when clicked
                            onClick={() => setSelectedExam(exam)}
                        >
                            <div className="ngat-box-content">
                                <span className="ngat-icon">🧠</span>
                                <span>{exam}</span>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                // --- STAGE 2: Show Single Link for the Selected Exam ---
                <div className="ngat-container">
                    <Link 
                        className="ngat-box single-exam" 
                        to={`/quiz/${selectedExam}`} 
                        onClick={() => {
                            // Clear necessary local storage items before starting the quiz
                            localStorage.removeItem("trace");
                            localStorage.removeItem("timeLeft");
                            localStorage.removeItem("examTitle");
                            localStorage.removeItem("showPopup");
                            // Determine mode and set it
                            const mode = selectedExam.includes("SAMPLE") ? "sample" : "full";
                            localStorage.setItem("mode", mode); // Added logic for 'mode'
                            // Set the specific exam path/identifier
                            localStorage.setItem("examPath", selectedExam);
                        }}
                    >
                        <div className="ngat-box-content">
                            <span className="ngat-icon">🚀</span>
                            <span>Start {selectedExam}</span>
                        </div>
                    </Link>
                    
                    {/* Optional: Add a back button */}
                    <div 
                        className="ngat-box back-button" 
                        onClick={() => setSelectedExam(null)}
                    >
                        <div className="ngat-box-content">
                            <span className="ngat-icon">🔙</span>
                            <span>Back to List</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NgatPage;