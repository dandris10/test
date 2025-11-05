import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const API_USER_MANAGEMENT = 'http://auth.localhost/api/auth/login';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Helper function to set a cookie properly
  const setCookie = (name, value, days = 1) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
};




  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      const response = await fetch(`${API_USER_MANAGEMENT}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // send cookies cross-origin
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        setError('Invalid username or password');
        return;
      }

      const result = await response.json();
      console.log('Login successful:', result);
      console.log('Access Token:', result.token);

      // Save JWT token as cookie for Traefik ForwardAuth
      setCookie('value', result.token); // name must match what your auth endpoint expects
      setCookie('username', username); // optional

      alert('Login successful!');
      
      // Redirect to user page
      navigate(`/mydevices`);
    } catch (err) {
      console.error('Login error:', err);
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Login</h1>
        
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
          </div>

          <button type="submit" className="login-btn">Login</button>
        </form>
      </div>
    </div>
  );
}
