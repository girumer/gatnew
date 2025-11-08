import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import axios from "axios";
export function atempts_Number(result){
    return result.filter(r=>r!==undefined).length;
}
export function earn_pointNumber(result,answers,point){
    return result.map((element,i)=>answers[i]==element).filter(i=>i).map(i=>point).reduce((prev,curr)=>prev+curr,0);
}
export function flagresult(totalpoints,earnpoints){
    return (totalpoints*50)/100<earnpoints;
}
export default function CheakUserExist({ children }) {
  const auth = useSelector((state) => state.result.userId);

  // If not logged in -> redirect to home page
  if (!auth) {
    return <Navigate to="/" replace />;
  }

  // Otherwise render child components
  return children;
}
export async function getServerData(url, callback) {
  try {
    const { data } = await axios.get(url); // destructure directly
    if (callback) return callback(data);   // optional callback
    return data;
  } catch (err) {
    console.error("Error fetching server data:", err.message);
    return null;
  }
}
export async function postServerData(url,result,callback) {
  const data=await(await axios.post(url,result))?.data;
return callback?callback(data):data
}