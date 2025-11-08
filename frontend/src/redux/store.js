import { configureStore, combineReducers } from '@reduxjs/toolkit';
import  questionReducer  from './question_reducer'
import  resultReducer  from './result_reducer'
const rootreducer = combineReducers({
    questions: questionReducer,
    result: resultReducer  // ✅ fixed
})

export default configureStore({reducer:rootreducer})