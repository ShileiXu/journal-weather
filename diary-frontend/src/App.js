import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import Diary from './components/Diary';
import PrivateRoute from './components/PrivateRoute'; // Import PrivateRoute
import './App.css';

const App = () => {
  return (
    <Router>
      <div className="app">
        <nav className="navbar">
          <h1 className="navbar-logo">Weather Diary</h1>
            <ul className="navbar-links">
              <li><a href="/diary">Diary</a></li>
              <li><a href="/login">Login</a></li>
              <li><a href="/signup">Sign Up</a></li>
            </ul>
        </nav>
        <Routes>
          {/* Wrap the Diary component with PrivateRoute */}
          <Route path="/" element={
            <PrivateRoute>
              <Diary />
            </PrivateRoute>
          } />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;