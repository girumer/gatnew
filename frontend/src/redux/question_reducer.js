import { createSlice } from '@reduxjs/toolkit';


export const questionReducer=createSlice({
    name:'questions',
    initialState:{
        queue:[],
        answers:[],
        trace:0
    },
    reducers:{
        startExamAction:(state,action)=>{
          let {question,answers}=action.payload;
            return{
                ...state,
                queue:question,
                answers
            }
        },
        moveNextAction:(state)=>{
          return{
            ...state,
           trace: state.trace + 1, 
          }
        },
         movePrevAction:(state)=>{
          return{
            ...state,
           trace: state.trace-1, 
          }
        },
       moveToQuestionAction: (state, action) => {
            return {
                ...state,
                trace: action.payload, // The payload will be the trace number (e.g., 5)
            }
        },
        resetAllAction:()=>{
            return{
              queue:[],
              answers:[],
              trace:0
            }
        }
    }
})
export const {startExamAction,moveNextAction, movePrevAction, resetAllAction}=questionReducer.actions;

export default questionReducer.reducer;