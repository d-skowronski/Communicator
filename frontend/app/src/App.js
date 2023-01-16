import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import StartPage from './pages/StartPage'
import ChatPage from './pages/ChatPage'
import AnonymousRoute from './utils/AnonymousRoute';
import LoggedInRoute from './utils/LoggedInRoute';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route exact element={<AnonymousRoute/>}>
            <Route element={<StartPage/>} path="/" exact/>
          </Route>
          <Route exact element={<LoggedInRoute/>}>
            <Route element={<ChatPage/>} path="/chat"/>
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
