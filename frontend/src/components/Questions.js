import React, { useEffect, useState } from 'react';
import './Questions.css';

import { useFetchQustion } from '../hooks/fetchQestion';
import { useSelector, useDispatch } from 'react-redux';
import { updateResultAction } from '../redux/result_reducer';
import { updateResult } from '../hooks/setResult';

function Questions({ onCheak, title }) {
  
       //const { title } = useParams();
  

const [{ isLoading, apiData, serverError }] = useFetchQustion(title);
 const { trace, answers } = useSelector(state => state.questions);

  const result = useSelector(state => state.result.result);
  const dispatch = useDispatch();
  const question = useSelector(state => state.questions.queue[state.questions.trace]);

  useEffect(() => {
    console.log(question);
  }, [question]);
const [cheaked, setCheack] = useState(undefined);
  useEffect(() => {
  setCheack(undefined);
}, [trace]);
  function onSelect(i) {
    onCheak(i);
    setCheack(i);
    dispatch(updateResultAction({ checked: i, trace }));
  }

  if (isLoading) {
    return <h2 className='text-light'>Loading...</h2>;
  }

  if (serverError) {
    return <h2 className='text-light'>{serverError.message || "unknown error"}</h2>;
  }

  if (!question) {
    return <h2 className='text-light'>No question found</h2>;
  }



  return (
    <div className='questions'>
      
     <h2 className='text-light'>{question?.question}</h2>

      {question?.image && (
        <div>
          <img
            src={question.image}
            alt="question"
            style={{ maxWidth: '100%', marginBottom: '1rem' }}
           
            onLoad={() => console.log('Image loaded successfully:', question.image)}
          />
          {/* Debug info */}
          
        </div>
      )}
    <ul key={question?.id}>
  {Array.isArray(question?.options) ? (
    question.options.map((q, i) => (
     
<li key={i}>
<input 
  type="radio"
  value={q}
  name={`question-${trace}`} // unique per question
  id={`q${i}-options`}
  onChange={() => onSelect(i)}
/>

  <div className={`check ${result[trace] === i ? 'checked' : ''}`}></div>

 <label
  className={`text-primary ${
    cheaked !== undefined && i === cheaked
      ? i === answers[trace]
        ? 'correct'
        : 'wrong'
      : ''
  }`}
  htmlFor={`q${i}-options`}
>
  {q}
</label>


</li>



    ))
  ) : (
    <li className="text-light">No options available</li>
  )}
</ul>
{cheaked !== undefined && question.explanation && (
  <div className="explanation-box">
    <h3 className="text-light">Explanation</h3>
    <p className="text-light">{question.explanation}</p>
  </div>
)}
    </div>
  );
}

export default Questions;
