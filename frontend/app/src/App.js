import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import StartPage from './pages/StartPage'
import AnonymousRoute from './utils/AnonymousRoute';
import LoggedInRoute from './utils/LoggedInRoute';
import SmallScreenOnlyRoute from './utils/SmallScreenOnlyRoute'
import SidebarAdderRoute from './utils/SidebarAdderRoute';
import './css/App.css'
import Sidebar from './components/Sidebar';
import Profile from './pages/Profile';
import Chat from './pages/Chat';

function App() {
  return (
    <BrowserRouter>
        <Routes>
          <Route exact element={<AnonymousRoute/>}>
            <Route element={<StartPage/>} path="/"/>
          </Route>

          <Route exact element={<LoggedInRoute/>}>
            <Route element={<SmallScreenOnlyRoute/>}>
              <Route element={<Sidebar sidebarOnlyDisplayed={true}/>} path="/communicator"/>
            </Route>

            <Route exact element={<SidebarAdderRoute/>}>
              <Route element={<Profile/>} path="/communicator/profile"/>
              <Route element={<Chat/>} path="/communicator/:room"/>
            </Route>

          </Route>
        </Routes>
    </BrowserRouter>
  );
}

export default App;
