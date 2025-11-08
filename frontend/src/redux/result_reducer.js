import { createSlice } from '@reduxjs/toolkit';
export const resultReducer=createSlice({
name: 'result',
    initialState: {
        result: [],   // ✅ array for answers
        userId: null
    },
reducers:{

pushResultAction:(state,action)=>{
    state.result.push(action.payload)
},
resetResultAction:()=>{
 return{
   
   result:[]
 }   
},
 updateResultAction:(state,action)=>{
          const {trace,checked}=action.payload;
          state.result.fill(checked,trace,trace+1);

        },
}

})
export const {pushResultAction,resetResultAction,updateResultAction}=resultReducer.actions;
export default resultReducer.reducer;