import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import InstallButton from './components/InstallButton';

function App() {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState(null);
  
  // PWA installation state
  const [installPrompt, setInstallPrompt] = useState(null);
  const [isAppInstalled, setIsAppInstalled] = useState(false);

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

  // PWA install prompt handler
  useEffect(() => {
    // Check if the app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsAppInstalled(true);
    }

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later
      setInstallPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    
    // Listen for app installed event
    window.addEventListener('appinstalled', () => {
      setIsAppInstalled(true);
      setInstallPrompt(null);
      console.log('PWA was installed');
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  // PWA install handler
  const handleInstallClick = async () => {
    if (!installPrompt) return;
    
    // Show the install prompt
    installPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const choiceResult = await installPrompt.userChoice;
    
    if (choiceResult.outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
    }
    
    // We no longer need the prompt
    setInstallPrompt(null);
  };

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <>
      {/* PWA Install Button - show only if not installed and prompt is available */}
      {!isAppInstalled && installPrompt && (
        <InstallButton onClick={handleInstallClick} />
      )}
      
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
    </>
  );
}

export default App;