function Admin({ onLogout, token }) {
    // Basic token validation
    if (!token) {
      return null; // Shouldn't happen due to Login.jsx logic
    }
  
    try {
      const tokenParts = token.split('.');
      if (tokenParts.length !== 3) throw new Error('Invalid token format');
  
      const payload = JSON.parse(atob(tokenParts[1]));
      if (payload.role !== 'admin' || payload.exp * 1000 < Date.now()) {
        onLogout();
        return null;
      }
    } catch (error) {
      console.error('Token validation failed:', error);
      onLogout();
      return null;
    }
  
    return (
      <div className="min-h-screen bg-gray-900 text-white flex flex-col">
        {/* Admin Header */}
        <header className="bg-gray-800 border-b border-blue-700 p-4">
          <div className="container mx-auto flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold text-blue-400">STUDIO 32</h1>
              <span className="bg-blue-600 px-2 py-1 rounded text-xs">Admin</span>
            </div>
            <button 
              onClick={onLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors"
            >
              Logout
            </button>
          </div>
        </header>
  
        {/* Main Content */}
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-blue-400 mb-4">Welcome to Admin Panel</h1>
            <p className="text-gray-400">You are logged in as administrator</p>
          </div>
        </main>
      </div>
    );
  }
  
  export default Admin;