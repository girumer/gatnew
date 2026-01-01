import React from 'react';
import { useNavigate } from 'react-router-dom';
import './UpgradeMenu.css';

const UpgradeMenu = () => {
  const navigate = useNavigate();

  const menuItems = [
    { id: 'how-to', label: '1) How to upgrade ERMP and NGAT' },
    { id: 'select-exam', label: '2) Select exam which u want to Take' },
    { id: 'about', label: '3) About menu items' }
  ];

  const handleButtonClick = (id) => {
    // This strictly redirects the first button to your new page
    if (id === 'how-to') {
      navigate('/how-to-upgrade');
    } 
     else if (id === 'select-exam') {
      navigate('/ExamMenu');
    } 
     else if (id === 'about') {
      navigate('/AboutMenu');
    } 
    else {
      console.log(`${id} clicked - no route assigned yet`);
    }
  };

  return (
    <div className="menu-page-wrapper">
      <div className="menu-container">
        <div className="menu-header">
          <h2>Portal Navigation how to use our app</h2>
          <p>Select an option to Get Informatoion</p>
        </div>
        
        <div className="button-vertical-group">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className="attractive-menu-btn"
              onClick={() => handleButtonClick(item.id)}
            >
              <span className="btn-text">{item.label}</span>
              <span className="btn-arrow">→</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UpgradeMenu;