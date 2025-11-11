import React from 'react';
import { Link } from 'react-router-dom';
import './main.css';

const Main = () => {
  return (
    <div className="container">
      
        <Link  className="box ngat" to={'/NGAT'} >
        NGAT
        <hp>jhdskjfh</hp>
</Link>
      
      <Link  className="box vindimate" to={'/VIDMATE'} >
        ERMP
</Link>
    </div>
  );
};

export default Main;
