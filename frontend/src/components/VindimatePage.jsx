import React, { useState, useEffect } from 'react';
import './VindimatePage.css';
import { Link, useLocation } from 'react-router-dom';

const years = ['2018','2019','2020','2021','2022','2023'];
const sampleExams = [
  'ERMP2018SAMPLE',
  'ERMP2019SAMPLE',
  'ERMP2020SAMPLE',
  'ERMP2021SAMPLE',
  'ERMP2022SAMPLE',
  'ERMP2023SAMPLE'
];

const VindimatePage = () => {
  const [selectedExam, setSelectedExam] = useState(null);
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const phone = params.get("phone"); 
  const username = params.get("username");
const sampleMode = params.get("sample") === "true";

  useEffect(() => {
    localStorage.removeItem("phone1");
    localStorage.removeItem("username1");

    if (phone) localStorage.setItem("phone1", phone);
    if (username) localStorage.setItem("username1", username);
  }, [phone, username]);

  return (
    <div className="vindimate-wrapper">
      <h1>
        welcome {username ? `${username}` : 'No username passed'}
      </h1>
      
      <h1 className="vindimate-title">
        {selectedExam ? `${selectedExam}` : 'ERMP EXAM LIST'}
      </h1>

  {!selectedExam ? (
  <div className="vindimate-container">

    {/* ✅ Show normal exams ONLY if not sample mode */}
    {!sampleMode && years.map((year, index) => (
      <div
        key={index}
        className="vindimate-box"
        onClick={() => setSelectedExam(`ERMP${year}`)}
      >
        <div className="vindimate-box-content">
          <span className="vindimate-icon">🩺</span>
          <span>ERMP {year}</span>
        </div>
      </div>
    ))}

    {/* ✅ Always show sample exams */}
    {sampleExams.map((exam, index) => (
      <div
        key={index}
        className="vindimate-box"
        onClick={() => setSelectedExam(exam)}
      >
        <div className="vindimate-box-content">
          <span className="vindimate-icon">🧪</span>
          <span>{exam}</span>
        </div>
      </div>
    ))}

  </div>
) : (

        <div className="vindimate-container">
          {selectedExam.includes("SAMPLE") ? (
            // Single sample exam
            <Link 
              className="vindimate-box single-exam" 
              to={`/quiz/${selectedExam}`} 
              onClick={() => {
                localStorage.removeItem("trace");
                localStorage.removeItem("timeLeft");
                localStorage.removeItem("examTitle");
                localStorage.removeItem("showPopup");
                localStorage.removeItem("mode");
                localStorage.setItem("examPath", selectedExam);
              }}
            >
              <div className="vindimate-box-content">
                <span className="vindimate-icon">🧪</span>
                <span>{selectedExam}</span>
              </div>
            </Link>
          ) : (
            // Normal exam with PART ONE / PART TWO
            <>
              <Link 
                className="vindimate-box part-one" 
                to={`/quiz/${selectedExam}PARTONE`} 
                onClick={() => {
                  localStorage.removeItem("trace");
                  localStorage.removeItem("timeLeft");
                  localStorage.removeItem("examTitle");
                  localStorage.removeItem("showPopup");
                  localStorage.removeItem("mode");
                  localStorage.setItem("examPath", `${selectedExam}PARTONE`);
                }}
              >
                <div className="vindimate-box-content">
                  <span className="vindimate-icon">🩺</span>
                  <span>PART ONE</span>
                </div>
              </Link>

              <Link 
                className="vindimate-box part-two" 
                to={`/quiz/${selectedExam}PARTTWO`} 
                onClick={() => { 
                  localStorage.removeItem("trace");
                  localStorage.removeItem("timeLeft");
                  localStorage.removeItem("examTitle");
                  localStorage.removeItem("showPopup");
                  localStorage.removeItem("mode");
                  localStorage.setItem("examPath", `${selectedExam}PARTTWO`);
                }}
              >
                <div className="vindimate-box-content">
                  <span className="vindimate-icon">🩺</span>
                  <span>PART TWO</span>
                </div>
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default VindimatePage;
