import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import StartPage from './pages/StartPage'
import LoggedInPage from './pages/LoggedInPage'
import AnonymousRoute from './utils/AnonymousRoute';
import LoggedInRoute from './utils/LoggedInRoute';
import './css/App.css'
import useWebsocket from './utils/hooks/websocket'

function App() {
  useWebsocket()
  return (
    <BrowserRouter>
        <Routes>
          <Route exact element={<AnonymousRoute/>}>
            <Route element={<StartPage/>} path="/"/>
          </Route>
          <Route exact element={<LoggedInRoute/>}>
            <Route element={<LoggedInPage/>} path="/communicator"/>
            <Route element={<LoggedInPage/>} path="/communicator/:room"/>
          </Route>
        </Routes>
    </BrowserRouter>
  );
}

export default App;
