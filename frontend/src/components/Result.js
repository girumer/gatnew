import React, { useEffect } from 'react'
import '../styles/Result.css';
import { Link } from 'react-router-dom';
import ResultTable from './ResultTable';
import { useDispatch, useSelector } from 'react-redux';
import { atempts_Number,earn_pointNumber,flagresult } from '../helper/helper';
import { resetAllAction } from '../redux/question_reducer';
import { resetResultAction } from '../redux/result_reducer';
import { usePublishResult } from '../hooks/setResult';
function Result() {
  const dispatch=useDispatch();
 const {questions:{queue,answers},result:{result,userId}}  = useSelector(state => state)
  
  useEffect(() => {
     console.log("Results:were", flag);
   }, []);
 const totalpoints=queue.length*5;
 const atempts=atempts_Number(result);
 const earnpoints=earn_pointNumber(result,answers,5);
 const flag=flagresult(totalpoints,earnpoints);
usePublishResult({result,username : userId,atempts,points:earnpoints,achived:flag ?"passed":"failed"})
 console.log("result is",{result,username : userId,atempts,points:earnpoints,achived:flag ?"passed":"failed"})
 function onRestart(){
    dispatch(resetAllAction());
    dispatch(resetResultAction());
  }
  return (
     <div className='container'>
      <h1 className='title text-light'>QuiZ Appliction</h1>
      <div className='result flex-center'>
        <div className='flex'>
           <span>Username </span>
           <span className='bold'>GAT EXAM</span>
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
      <ResultTable></ResultTable>
    </div>
    </div>
  )
}

export default Result
