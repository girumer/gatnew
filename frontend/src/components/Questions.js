import React, { useEffect, useState } from 'react';
import './Questions.css';

import { useFetchQustion } from '../hooks/fetchQestion';
import { useSelector, useDispatch } from 'react-redux';
import { updateResultAction } from '../redux/result_reducer';
import { updateResult } from '../hooks/setResult';

function Questions({ onCheak, title,mode  }) {
  
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
useEffect(() => {
  // Disable right-click context menu
  const handleContextMenu = (e) => e.preventDefault();
  document.addEventListener("contextmenu", handleContextMenu);

  // Disable copy shortcut
  const handleKeyDown = (e) => {
    if (e.ctrlKey && (e.key === "c" || e.key === "x")) {
      e.preventDefault();
    }
  };
  document.addEventListener("keydown", handleKeyDown);

  return () => {
    document.removeEventListener("contextmenu", handleContextMenu);
    document.removeEventListener("keydown", handleKeyDown);
  };
}, []);

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
        <div className="watermark">Exam: {title}</div>
     <h2 className='text-light'>{question?.question}</h2>

      {question?.image && (
        <div>
          <img
            // REMOVE the .replace() to use the original HTTP URL
            src={question.image.replace("http://", "https://")}
            alt="question"
            style={{ maxWidth: '100%', marginBottom: '1rem' }}
           
            onLoad={() => console.log('Image loaded successfully:', question.image)}
            // Add an onError handler for better debugging
             onError={(e) => console.error('Image failed to load with source:', e.target.src)}
          />
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
    mode === 'study' && cheaked !== undefined && i === cheaked
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
{mode === 'study' && cheaked !== undefined && (question.explanation || question.explanationImage) && (
    <div className="explanation-box">
        <h3 className="text-light">Explanation</h3>
        
        {/* 1. Render the text explanation */}
        {question.explanation && (
                <p className="text-light">{question.explanation}</p>
        )}

        {/* 2. Render the explanation image */}
        {question.explanationImage && (
            <div style={{ marginTop: '1rem' }}>
                <img
                    // Your logic to handle image source
                    src={question.explanationImage.replace("http://", "https://")}
                    alt="Explanation Diagram"
                    style={{ maxWidth: '100%', border: '1px solid #333' }}
                    onLoad={() => console.log('Explanation image loaded successfully:', question.explanationImage)}
                    onError={(e) => console.error('Explanation image failed to load with source:', e.target.src)}
                />
            </div>
        )}

    </div>
)}

    </div>
  );
}

export default Questions;
