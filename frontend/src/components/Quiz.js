import React, { useEffect, useState } from 'react';
import Questions from './Questions';
import { useParams } from 'react-router-dom';
 import './Quiz.css';
import { moveNextquestion, movePrevquestion } from '../hooks/fetchQestion';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { PushAnswer } from '../hooks/setResult';
import { updateResultAction } from '../redux/result_reducer';

function Quiz() {
    const [timeLeft, setTimeLeft] = useState(100 * 60);
     const { title } = useParams();
  const [cheak, setCheack] = useState(undefined);
  const dispatch = useDispatch();
useSelector(state => console.log(state));
  const { queue, trace } = useSelector(state => state.questions);

   const result = useSelector(state => state.result.result); 

  useEffect(() => {
    console.log("Results:", result);
  }, [result]);
useEffect(() => {
  const timer = setInterval(() => {
    setTimeLeft(prev => {
      if (prev <= 1) {
        clearInterval(timer);
        return 0;
      }
      return prev - 1;
    });
  }, 1000);

  return () => clearInterval(timer); // cleanup on unmount
}, []);
function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

 
function onCheak(i){
        setCheack(i)
    }

    /** finished exam after the last question */
    if(result.length && result.length >= queue.length){
        return <Navigate to={'/result'} replace={true}></Navigate>
    }
  function onPrev() {
    if (trace > 0) {
      dispatch(movePrevquestion());
    }
  }
   function onNext(){
        if(trace < queue.length){
            /** increase the trace value by one using MoveNextAction */
            dispatch(moveNextquestion());

            /** insert a new result in the array.  */
            if(result.length <= trace){
                dispatch(PushAnswer(cheak))
                console.log(queue.length);
            }
        }
     
        /** reset the value of the checked variable */
        setCheack(undefined)
    }

  if (result.length && result.length >= queue.length) {
    return <Navigate to="/result" replace={true} />;
  }

  return (
    <div className="container">
     <div className='timer'>
      <h1 className="title text-light">Quiz Application</h1>

      {/* ✅ Timer directly below the title */}
      <div className="timer">
        <h3 className="text-timer">Time Left: {formatTime(timeLeft)}</h3>
      </div>
    </div>
      <Questions onCheak={onCheak} title={title} />

      <div className="grid">
      {trace > 0 ? <button className="btn prev" onClick={onPrev}>Prev</button>:<div></div> }
        <button className="btn next" onClick={onNext}>Next</button>
      </div>
    </div>
  );
}

export default Quiz;