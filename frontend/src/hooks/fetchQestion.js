import { useEffect, useState } from "react";

import { useDispatch } from "react-redux";
import * as Action from '../redux/question_reducer'
import { getServerData } from "../helper/helper";
export const useFetchQustion = (title) => {
  const dispatch = useDispatch();
  const [getData, setGetData] = useState({
    isLoading: false,
    apiData: [],
    serverError: null,
  });

  useEffect(() => {
    if (!title || typeof title !== 'string') {
      console.warn("Missing or invalid exam title:", title);
      setGetData(prev => ({
        ...prev,
        isLoading: false,
        serverError: new Error("Missing or invalid exam title")
      }));
      return;
    }

    setGetData(prev => ({ ...prev, isLoading: true }));

    (async () => {
      try {
        const endpoint = `/api/questions/${title.trim()}`;
        const apiResponse = await getServerData(
          `${process.env.REACT_APP_BACKENDURL}${endpoint}`,
          (data) => data
        );

        const questions = apiResponse.q || [];
        const answers = questions.map((q) => q.answer);

        if (questions.length > 0) {
          setGetData(prev => ({
            ...prev,
            isLoading: false,
            apiData: questions,
          }));
          dispatch(Action.startExamAction({ question: questions, answers }));
        } else {
          throw new Error("No questions available");
        }
      } catch (error) {
        console.error("Fetch error:", error);
        setGetData(prev => ({
          ...prev,
          isLoading: false,
          serverError: error,
        }));
      }
    })();
  }, [dispatch, title]);

  return [getData, setGetData];
};


export const moveNextquestion=()=>async(dispach)=>{
    try{
      dispach(Action.moveNextAction())
    }catch(error){
      console.log(error)
    }
}
export const  movePrevquestion=()=>async(dispach)=>{
    try{
      dispach(Action. movePrevAction())
    }catch(error){
      console.log(error)
    }
}