import { Navigate, useLocation } from 'react-router-dom';

// This component wraps protected routes and redirects to login if not authenticated
function ProtectedRoute({ children, isAuthenticated }) {
  const location = useLocation();
  
  if (!isAuthenticated) {
    // Redirect to login page but save the location they were trying to access
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }
  
  return children;
}

export default ProtectedRoute;