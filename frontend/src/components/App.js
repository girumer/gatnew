

import {createBrowserRouter,RouterProvider} from 'react-router-dom';
import Main from './Main';
import Quiz from './Quiz';
import UpgradeMenu from './UpgradeMenu';
import HowToUpgrade from './HowToUpgrade';
import ExamMenu from './ExamMenu';
import AboutMenu from './AboutMenu';
import NgatPage from './NgatPage';
import VindimatePage from './VindimatePage';
import Result from './Result';
import UserList from './UserList';
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
    path: '/how-to-upgrade',
    element: <HowToUpgrade />
  },
   {
    path : '/result',
    element:<Result></Result>
  },
  
   {
    path : '/user',
    element:<UserList></UserList>
  },
 {
    path : '/NGAT',
    element:<NgatPage></NgatPage>
  },
  {
    path : '/VIDMATE',
    element:<VindimatePage></VindimatePage>
  },
    {
    path : '/Upgrade',
    element:<UpgradeMenu></UpgradeMenu>
  },
  {
    path : '/ExamMenu',
    element:<ExamMenu></ExamMenu>
  },
  {
    path : '/AboutMenu',
    element:<AboutMenu></AboutMenu>
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
