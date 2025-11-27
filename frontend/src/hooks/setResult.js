import { postServerData } from '../helper/helper'
import * as Action from '../redux/result_reducer'

export const PushAnswer = (result) => async (dispatch) => {
  try {
    await dispatch(Action.pushResultAction(result));
  } catch (error) {
    console.log(error);
  }
};

export const updateResult = (index) => async (dispatch) => {
  try {
    await dispatch(Action.updateResultAction(index));   // ✅ FIXED
  } catch (error) {
    console.log(error);
  }
};

export const usePublishResult = (resultData) => {
  const { result, username } = resultData;

  (async () => {
    try {
      if (!result || result.length === 0)
        throw new Error("No result to save");

      if (!username)
        throw new Error("Username missing");

      await postServerData(
        `${process.env.REACT_APP_BACKENDURL}/api/result`,
        resultData,
        (data) => data
      );
    } catch (error) {
      console.log("Publish error:", error);
    }
  })();
};
