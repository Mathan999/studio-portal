import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
    setError(''); // Clear error when user types
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login attempt with:', credentials);
    
    // Validation logic
    if (credentials.username === 'studio32' && credentials.password === '12345') {
      // Successful login
      console.log('Login successful!');
      navigate('/dashboard'); // Redirect to dashboard
    } else {
      // Failed login
      setError('Invalid username or password');
    }
  };

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
              required
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-300 font-medium"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;