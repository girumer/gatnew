import React, { useEffect } from 'react'
import '../styles/Result.css';
import { Link } from 'react-router-dom';
import ResultTable from './ResultTable';
import { useDispatch, useSelector } from 'react-redux';
import { atempts_Number,earn_pointNumber,flagresult } from '../helper/helper';
import { resetAllAction } from '../redux/question_reducer';
import { resetResultAction } from '../redux/result_reducer';
import { usePublishResult } from '../hooks/setResult';
import { useLocation } from 'react-router-dom';
import UserResults from './UserResults';
function Result() {
  const dispatch=useDispatch();
 const {questions:{queue,answers},result:{result,userId}}  = useSelector(state => state)
   const { search } = useLocation();
  const params = new URLSearchParams(search);
  
   //const username=localStorage.getItem("username1")
  //const phoneNumber=localStorage.getItem("phone1");
     const username=localStorage.getItem("username1")
  const phoneNumber=localStorage.getItem("phone1");
  useEffect(() => {
     console.log("Results:were", flag);
   }, []);
  useEffect(() => {
    localStorage.removeItem("phone1");
    localStorage.removeItem("username1");

    if (phoneNumber) localStorage.setItem("phone1", phoneNumber);
    if (username) localStorage.setItem("username1", username);
  }, [phoneNumber, username]);

 const totalpoints=queue.length;
 const atempts=atempts_Number(result);
 const earnpoints=earn_pointNumber(result,answers,1);

 const flag=flagresult(totalpoints,earnpoints);
 const examPath = localStorage.getItem("examPath");
 const exam = examPath.slice(0, 4);
const year = examPath.slice(4, 8);
const part = examPath.slice(8);
usePublishResult({
  username: username,
  phoneNumber:phoneNumber,
  result,
  attempts: atempts,
  points: earnpoints,
  achived: flag ? "passed" : "failed",
   exam,
  year,
  part
});


 console.log("result is",{result,username : userId,atempts,points:earnpoints,achived:flag ?"passed":"failed"}
   )
  
 function onRestart(){
    dispatch(resetAllAction());
    dispatch(resetResultAction());
  }
  return (
     <div className='container'>
      <h1 className='title text-light'>QuiZ Appliction</h1>
      <div className='result flex-center'>
        <div className='flex'>
           <span>User Name </span>
  <span className='bold'>{username || "No phone passed"}</span>
        </div>
          <div className='flex'>
           <span>Total Quiz Point </span>
           <span className='bold'>{totalpoints||0}</span>
        </div>
          <div className='flex'>
           <span>Total Questions  </span>
           <span className='bold'>{queue.length||0}</span>
        </div>
          <div className='flex'>
           <span>Total Atempts </span>
           <span className='bold'>{atempts||0}</span>
        </div>
          <div className='flex'>
           <span>Total Earn points </span>
           <span className='bold'>{earnpoints||0}</span>
        </div>
        <div className='flex'>
           <span>Quiz result  </span>
           <span style={{ color : `${flag ? "#2aff95" : "#ff2a66" }` }} className='bold'>{flag ? "Passed" : "Failed"}</span>
        </div>
      </div>
   <div className='start'>
    <Link className='btn' to={'/'} onClick={onRestart}>RESTART</Link>
   </div>
    <div className='contianer'>
      <UserResults phone={phoneNumber} />
    </div>
    </div>
  )
}

export default Result
