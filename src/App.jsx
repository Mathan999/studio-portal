import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import InstallPWA from './components/InstallPWA';
import './assets/Loader.css'; // Import the CSS for the loader

function App() {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState(null);
  
  // Check for stored authentication on component mount
  useEffect(() => {
    const storedToken = sessionStorage.getItem('authToken');
    if (storedToken) {
      try {
        const tokenParts = storedToken.split('.');
        if (tokenParts.length !== 3) throw new Error('Invalid token format');
        
        const payload = JSON.parse(atob(tokenParts[1]));
        if (payload.exp * 1000 > Date.now()) {
          setIsAuthenticated(true);
          setToken(storedToken);
        } else {
          // Token expired
          sessionStorage.removeItem('authToken');
        }
      } catch (error) {
        console.error('Token validation failed:', error);
        sessionStorage.removeItem('authToken');
      }
    }
    setIsLoading(false);
  }, []);

  // Login success handler
  const handleLoginSuccess = (newToken) => {
    try {
      const tokenParts = newToken.split('.');
      if (tokenParts.length !== 3) throw new Error('Invalid token format');

      sessionStorage.setItem('authToken', newToken);
      setToken(newToken);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Login token validation failed:', error);
      sessionStorage.removeItem('authToken');
    }
  };

  // Logout handler
  const handleLogout = () => {
    sessionStorage.removeItem('authToken');
    setToken(null);
    setIsAuthenticated(false);
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loader">
          <div className="loader__bar"></div>
          <div className="loader__bar"></div>
          <div className="loader__bar"></div>
          <div className="loader__bar"></div>
          <div className="loader__bar"></div>
          <div className="loader__ball"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* PWA Install Button - Always visible */}
      <InstallPWA />
      
      <Router>
        <Routes>
          {/* Redirect root to login */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Login route: handles both admin and user access */}
          <Route
            path="/login"
            element={<Login onLoginSuccess={handleLoginSuccess} onLogout={handleLogout} />}
          />

          {/* Dashboard route: protected for users */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated} token={token} requiredRole="user">
                <Dashboard onLogout={handleLogout} token={token} />
              </ProtectedRoute>
            }
          />

          {/* Catch-all for invalid routes */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;