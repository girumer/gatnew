import React from 'react';
import  { useState,useEffect } from 'react';
import './NgatPage.css';
import { Link,useLocation } from 'react-router-dom';
const NgatPage = () => {
  const exams = ['GAT1', 'GAT2', 'GAT3', 'GAT4'];
const { search } = useLocation();
  const params = new URLSearchParams(search);
  const phone = params.get("phone"); 
  const username = params.get("username");
  useEffect(() => {
  localStorage.removeItem("phone");
  localStorage.removeItem("username");

  if (phone) localStorage.setItem("phone", phone);
  if (username) localStorage.setItem("username", username);
}, [phone, username]);
const userphone = localStorage.getItem("phone");
const userusername = localStorage.getItem("username");
  return (
    <div className="ngat-wrapper">
      <h1>
        welcome
             {username ? `User: ${username}` : 'No username passed'}
      </h1>
      <h1 className="ngat-title">NGAT EXAM LIST</h1>
      <div className="ngat-container">
       {exams.map((exam, index) => (
  <Link 
    key={index} 
    className="ngat-box" 
    to={`/quiz/${exam}`}
  >
    <div className="ngat-box-content">
      <span className="ngat-icon">📊</span>
      <span className="ngat-label">{exam}</span>
    </div>
  </Link>
))}

      </div>
    </div>
  );
};

export default NgatPage;
