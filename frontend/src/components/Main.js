import React from 'react';
import { Link } from 'react-router-dom';
import './main.css';

const Main = () => {
  return (
    <div className="container" >
   <Link className="box ngat" to="/NGAT">
  <div className="box-content">
    <span className="icon">📊</span>
    <span className="label">NGAT</span>
  </div>
</Link>

<Link className="box vindimate" to="/VIDMATE">
  <div className="box-content">
    <span className="icon">🩺</span>
    <span className="label">ERMP</span>
  </div>
</Link>

    </div>
  );
};

export default Main;
