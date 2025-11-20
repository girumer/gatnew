import React from 'react';
import './NgatPage.css';
import { Link } from 'react-router-dom';
const NgatPage = () => {
  const exams = ['GAT1', 'GAT2', 'GAT3', 'GAT4'];

  return (
    <div className="ngat-wrapper">
      <h1 className="ngat-title">NGAT EXAM LIST</h1>
      <div className="ngat-container">
        {exams.map((exam, index) => (
          <Link 
            key={index} 
            className="ngat-box" 
            to={`/quiz/${exam}`}
          >
            {exam}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default NgatPage;
