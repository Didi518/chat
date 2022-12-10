import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Chat from './pages/Chat';
import Login from './pages/Login';
import Register from './pages/Register';
import SetAvatar from './pages/SetAvatar';

export default function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/inscription" element={<Register />} />
          <Route path="/connexion" element={<Login />} />
          <Route path="/avatar" element={<SetAvatar />} />
          <Route path="/" element={<Chat />} />
        </Routes>
      </div>
    </Router>
  );
}
