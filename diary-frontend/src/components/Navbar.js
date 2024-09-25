import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  //check authentication status on component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  //Sign Out
  const handleSignOut = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    navigate('/login'); //redirect user to Login page
  };

  return (
    <nav className="navbar">
      <h1 className="navbar-logo" onClick={() => navigate('/')}>Weather Diary</h1>
      <ul className="navbar-links">
        {isLoggedIn ? (
          <>
            <li><button className="nav-button" onClick={() => navigate('/diary')}>Diary</button></li>
            <li><button className="nav-button" onClick={handleSignOut}>Sign Out</button></li>
          </>
        ) : (
          <>
            <li><button className="nav-button" onClick={() => navigate('/login')}>Login</button></li>
            <li><button className="nav-button" onClick={() => navigate('/signup')}>Sign Up</button></li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;