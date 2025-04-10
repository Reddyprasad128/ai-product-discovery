import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import jwtDecode from 'jwt-decode';

function Login({ setToken, setRole }) {
  const [username, setUsername] = useState('reddy');
  const [password, setPassword] = useState('1234');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  const handleLogin = async () => {
    if (!username || !password) {
      setErrorMsg('Please enter both username and password.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const response = await axios.post(`${API_URL}/api/login`, { username, password });

      const { token } = response.data;
      const decoded = jwtDecode(token);

      if (decoded.exp && decoded.exp < Date.now() / 1000) {
        setErrorMsg('Token is expired.');
        return;
      }

      const userRole = decoded.role || 'user';

      setToken(token);
      setRole(userRole);
      localStorage.setItem('token', token);
      localStorage.setItem('role', userRole);

      if (userRole === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      const message = error.response?.data || 'Login failed. Please try again.';
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Login</h1>

        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          disabled={loading}
          className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <div className="relative mb-4">
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            disabled={loading}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-2 text-sm text-blue-600"
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition duration-200"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>

        {errorMsg && <p className="text-red-500 mt-4 text-center">{errorMsg}</p>}

        <p className="text-center text-sm text-gray-600 mt-6">
          Don't have an account?{' '}
          <Link to="/signup" className="text-blue-600 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
