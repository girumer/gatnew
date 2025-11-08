

import {createBrowserRouter,RouterProvider} from 'react-router-dom';
import Main from './Main';
import Quiz from './Quiz';
import Result from './Result';
import NgatPage from './NgatPage';
import VindimatePage from './VindimatePage';


const router=createBrowserRouter([
  {
    path : '/',
    element:<Main></Main>
  },
 
   {
  path : '/quiz/:title',
  element:<Quiz />
},

   {
    path : '/result',
    element:<Result></Result>
  },
 {
    path : '/NGAT',
    element:<NgatPage></NgatPage>
  },
  {
    path : '/VIDMATE',
    element:<VindimatePage></VindimatePage>
  },
])
function App() {
  return (
    <>
    <RouterProvider router={router}/>
    </>
  );
}

export default App;
