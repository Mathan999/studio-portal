import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
    
  // Check for any stored authentication on component mount
  useEffect(() => {
    // Check if we have a token in sessionStorage
    const token = sessionStorage.getItem('authToken');
    if (token) {
      // Validate the token here (in a real app, you'd verify with your backend)
      try {
        const tokenData = JSON.parse(atob(token.split('.')[1]));
        if (tokenData && tokenData.exp > Date.now() / 1000) {
          setIsAuthenticated(true);
        } else {
          // Token expired
          sessionStorage.removeItem('authToken');
        }
      // eslint-disable-next-line no-unused-vars
      } catch (e) {
        // Invalid token format
        sessionStorage.removeItem('authToken');
      }
    }
    setIsLoading(false);
  }, []);
  
  // Login success handler
  const handleLoginSuccess = (token) => {
    // Store auth token in sessionStorage (in a real app, this would be a JWT from your backend)
    const secureToken = token || `secure.${btoa(JSON.stringify({
      userId: 'user123',
      exp: Math.floor(Date.now() / 1000) + (60 * 60) // 1 hour expiration
    }))}.signature`;
    
    sessionStorage.setItem('authToken', secureToken);
    setIsAuthenticated(true);
  };
  
  // Logout handler
  const handleLogout = () => {
    // Remove the token from sessionStorage
    sessionStorage.removeItem('authToken');
    setIsAuthenticated(false);
  };
  
  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
                
        {/* Login is always accessible, but redirects if already logged in */}
        <Route 
          path="/login" 
          element={
            isAuthenticated ? 
              <Navigate to="/dashboard" replace /> : 
              <Login onLoginSuccess={handleLoginSuccess} />
          } 
        />
                
        {/* Dashboard route is protected */}
        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Dashboard onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />

        {/* Catch all unauthorized attempts */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;