import React, { useState,useEffect } from 'react';
import './VindimatePage.css';
import { Link, useLocation  } from 'react-router-dom';

const years = ['2019','2020', '2021', '2022', '2023'];

const VindimatePage = () => {
  const [selectedYear, setSelectedYear] = useState(null);
const { search } = useLocation();
  const params = new URLSearchParams(search);
  const phone = params.get("phone"); 
  const username = params.get("username");
  useEffect(() => {
  localStorage.removeItem("phone1");
  localStorage.removeItem("username1");

  if (phone) localStorage.setItem("phone1", phone);
  if (username) localStorage.setItem("username1", username);
}, [phone, username]);
 

  return (
    <div className="vindimate-wrapper">
      <h1>
        welcome
             {username ? `User: ${username}` : 'No username passed'}
      </h1>
        <h1>
        your phone
             {phone ? `phone: ${phone}` : 'No phone passed'}
      </h1>
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
    <Link className="vindimate-box part-one" to={`/quiz/ERMP${selectedYear}PARTONE`} onClick={() => localStorage.setItem("examPath", `ERMP${selectedYear}PARTONE`)}>PART ONE</Link>
    <Link className="vindimate-box part-two" to={`/quiz/ERMP${selectedYear}PARTTWO`} onClick={() => localStorage.setItem("examPath", `ERMP${selectedYear}PARTTWO`)}>PART TWO</Link>

        </div>
      )}
    </div>
  );
};

export default VindimatePage;
