import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HowToUpgrade.css'; 

const ExamMenu = () => {
  const navigate = useNavigate();

  return (
    <div className="menu-page-wrapper">
      <div className="menu-container wide-container"> 
        <div className="menu-header">
          <button onClick={() => navigate(-1)} className="back-btn">
            ← Back to Menu
          </button>
          <h2>To Find EXAM MENU</h2>
          <p>Follow the visual guide below for ERMP and NGAT</p>
        </div>

        <div className="image-card">
          {/* This looks for the image in your 'public' folder */}
          <img 
            src="/exammenu.png" 
            alt="EXAM MENU Instructions Guide" 
            className="full-width-image"
          />
        </div>

        <div className="footer-note">
          <p>Need more help? Contact technical support.</p>
        </div>
      </div>
    </div>
  );
};

export default ExamMenu;