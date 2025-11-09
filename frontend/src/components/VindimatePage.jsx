import React, { useState } from 'react';
import './VindimatePage.css';
import { Link } from 'react-router-dom';

const years = ['2020', '2021', '2022', '2023'];

const VindimatePage = () => {
  const [selectedYear, setSelectedYear] = useState(null);

  return (
    <div className="vindimate-wrapper">
      <h1 className="vindimate-title">
        {selectedYear ? `VINDIMATE ${selectedYear} PARTS` : 'ERMP EXAM LIST'}
      </h1>

      {!selectedYear ? (
        <div className="vindimate-container">
          {years.map((year, index) => (
            <div
              key={index}
              className="vindimate-box"
              onClick={() => setSelectedYear(year)}
            >
              ERMP{year}
            </div>
          ))}
        </div>
      ) : (
        <div className="vindimate-container">
    <Link className="vindimate-box part-one" to={`/quiz/ERMP${selectedYear}PARTONE`}>PART ONE</Link>
    <Link className="vindimate-box part-two" to={`/quiz/ERMP${selectedYear}PARTTWO`}>PART TWO</Link>

        </div>
      )}
    </div>
  );
};

export default VindimatePage;
