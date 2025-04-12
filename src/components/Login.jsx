import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Admin from '../components/Admin';

function Login({ onLoginSuccess, onLogout }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockTimer, setLockTimer] = useState(0);
  const [showAdmin, setShowAdmin] = useState(false);
  const [userToken, setUserToken] = useState(null);

  // Check if there was a redirect from a protected route
  useEffect(() => {
    if (location.state?.from) {
      setError(`Please login to access ${location.state.from}`);
    }
  }, [location]);

  // Handle account lockout countdown
  useEffect(() => {
    let interval;
    if (isLocked && lockTimer > 0) {
      interval = setInterval(() => {
        setLockTimer(prev => prev - 1);
      }, 1000);
    } else if (lockTimer === 0 && isLocked) {
      setIsLocked(false);
      setLoginAttempts(0);
    }

    return () => clearInterval(interval);
  }, [isLocked, lockTimer]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
    setError(''); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if account is locked
    if (isLocked) {
      setError(`Account temporarily locked. Try again in ${lockTimer} seconds.`);
      return;
    }

    try {
      // Check admin credentials
      if (credentials.username === 'admin' && credentials.password === 'stdio') {
        // Create admin token
        const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${btoa(JSON.stringify({
          username: credentials.username,
          role: 'admin',
          exp: Math.floor(Date.now() / 1000) + (60 * 60) // 1 hour
        }))}.signature`;

        // Pass token to parent (App.jsx)
        onLoginSuccess(token);

        // Store token for Admin component
        setUserToken(token);

        // Show Admin component directly
        setShowAdmin(true);
        return;
      } 
      // Check regular user credentials
      else if (credentials.username === 'studio32' && credentials.password === '12345') {
        // Create user token
        const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${btoa(JSON.stringify({
          username: credentials.username,
          role: 'user',
          exp: Math.floor(Date.now() / 1000) + (60 * 60) // 1 hour
        }))}.signature`;

        // Pass token to parent
        onLoginSuccess(token);

        // Navigate to dashboard
        const destination = location.state?.from || '/dashboard';
        navigate(destination, { replace: true });
        return;
      } 
      else {
        // Failed login
        handleFailedLogin();
      }
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    }
  };

  const handleFailedLogin = () => {
    const newAttempts = loginAttempts + 1;
    setLoginAttempts(newAttempts);

    if (newAttempts >= 5) {
      // Lock account for 30 seconds after 5 failed attempts
      setIsLocked(true);
      setLockTimer(30);
      setError('Too many failed attempts. Account locked for 30 seconds.');
    } else {
      setError(`Invalid username or password. Attempts: ${newAttempts}/5`);
    }
  };

  // Show Admin component directly if admin credentials are verified
  if (showAdmin && userToken) {
    return <Admin onLogout={() => {
      setShowAdmin(false);
      setUserToken(null);
      setCredentials({ username: '', password: '' });
      onLogout();
    }} token={userToken} />;
  }

  // Otherwise show login form
  return (
    <div className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center overflow-auto">
      <div className="bg-gray-900 p-6 md:p-8 rounded-lg shadow-xl w-full max-w-md mx-4 md:mx-0 border border-blue-700 my-4">
        <div className="text-center mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-blue-400">STUDIO 32</h1>
          <p className="text-gray-400 mt-2">Please sign in to your account</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-900 bg-opacity-50 border border-red-500 rounded text-red-300 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-5 md:mb-6">
            <label htmlFor="username" className="block text-blue-300 text-sm font-medium mb-2">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={credentials.username}
              onChange={handleChange}
              className="w-full px-3 md:px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-white"
              placeholder="Enter your username"
              disabled={isLocked}
              required
            />
          </div>

          <div className="mb-5 md:mb-6">
            <label htmlFor="password" className="block text-blue-300 text-sm font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              className="w-full px-3 md:px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-white"
              placeholder="Enter your password"
              disabled={isLocked}
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLocked}
            className={`w-full text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-300 font-medium ${
              isLocked ? 'bg-blue-800 opacity-50 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isLocked ? `Locked (${lockTimer}s)` : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;