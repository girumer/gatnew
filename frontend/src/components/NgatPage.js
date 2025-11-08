import React from 'react';
import './NgatPage.css';

const NgatPage = () => {
  const exams = ['NGAT2020', 'NGAT2021', 'NGAT2022', 'NGAT2024'];

  return (
    <div className="ngat-wrapper">
      <h1 className="ngat-title">NGAT EXAM LIST</h1>
      <div className="ngat-container">
        {exams.map((exam, index) => (
          <div key={index} className="ngat-box">
            {exam}
          </div>
        ))}
      </div>
    </div>
  );
};

export default NgatPage;
