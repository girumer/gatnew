
import { postServerData } from '../helper/helper'
import * as Action from '../redux/result_reducer'
export const PushAnswer= (result) => async (dispatch) => {
    try {
        await dispatch(Action.pushResultAction(result))
    } catch (error) {
        console.log(error)
    }
}
export const updateResult= (index) => async (dispatch) => {
    try {
        await dispatch(Action.pushResultAction(index))
    } catch (error) {
        console.log(error)
    }
}
export const usePublishResult =(resultData)=>{
    const {result,username}=resultData;
    (async()=>{
       try{
          if (result!=[]&&!username) throw new Error("could not get result");
         await postServerData(`${process.env.REACT_APP_BACKENDURL}/api/result`,resultData,data=>data)
       }
       catch(error){
        console.log(error);
       }
    })()

}