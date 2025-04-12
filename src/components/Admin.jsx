import React from 'react';

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
  
  // Handle adding new items
  const handleAddItem = (section) => {
    const inputField = document.getElementById(`input-${section}`);
    if (inputField && inputField.value.trim()) {
      alert(`Added "${inputField.value}" to ${section}`);
      inputField.value = '';
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900 text-white overflow-hidden">
      {/* Fixed Background Container */}
      <div className="absolute inset-0 bg-gray-900" style={{ zIndex: -1 }}></div>
      
      <div className="flex flex-col h-full w-full">
        {/* Admin Header */}
        <header className="bg-gray-800 border-b border-blue-700 p-4 sticky top-0 z-10">
          <div className="w-full max-w-6xl mx-auto flex flex-wrap justify-between items-center">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <h1 className="text-lg sm:text-xl font-bold text-blue-400">STUDIO 32</h1>
              <span className="bg-blue-600 px-2 py-1 rounded text-xs">Admin</span>
            </div>
            <button
              onClick={onLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors mt-2 sm:mt-0"
            >
              Logout
            </button>
          </div>
        </header>
        
        {/* Main Content - Scrollable */}
        <main className="flex-grow p-3 sm:p-6 w-full overflow-y-auto">
          <div className="w-full max-w-4xl mx-auto bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6 mb-6">
            <h1 className="text-xl sm:text-2xl font-bold text-blue-400 mb-4 sm:mb-6 text-center">Admin Panel</h1>
            
            {/* Basic Information Section */}
            <div className="mb-6">
              <h2 className="text-lg sm:text-xl font-semibold text-blue-300 mb-3 sm:mb-4">Basic Information</h2>
              
              <div className="grid grid-cols-1 gap-4">
                {/* Job Type */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Job Type:
                  </label>
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                    <input
                      id="input-JobType"
                      type="text"
                      className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white"
                      placeholder="Enter job type"
                    />
                    <button
                      onClick={() => handleAddItem('JobType')}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors sm:whitespace-nowrap"
                    >
                      Add
                    </button>
                  </div>
                </div>
                
                {/* Status */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Status:
                  </label>
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                    <input
                      id="input-Status"
                      type="text"
                      className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white"
                      placeholder="Enter status"
                    />
                    <button
                      onClick={() => handleAddItem('Status')}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors sm:whitespace-nowrap"
                    >
                      Add
                    </button>
                  </div>
                </div>
                
                {/* Hold */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Hold:
                  </label>
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                    <input
                      id="input-Hold"
                      type="text"
                      className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white"
                      placeholder="Enter hold"
                    />
                    <button
                      onClick={() => handleAddItem('Hold')}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors sm:whitespace-nowrap"
                    >
                      Add
                    </button>
                  </div>
                </div>
                
                {/* Complexities */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Complexities:
                  </label>
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                    <input
                      id="input-Complexities"
                      type="text"
                      className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white"
                      placeholder="Enter complexities"
                    />
                    <button
                      onClick={() => handleAddItem('Complexities')}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors sm:whitespace-nowrap"
                    >
                      Add
                    </button>
                  </div>
                </div>
                
                {/* Assigned User */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Assigned User:
                  </label>
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                    <input
                      id="input-AssignedUser"
                      type="text"
                      className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white"
                      placeholder="Enter assigned user"
                    />
                    <button
                      onClick={() => handleAddItem('AssignedUser')}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors sm:whitespace-nowrap"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Project Details Section - NEWLY ADDED */}
            <div className="mb-6">
              <h2 className="text-lg sm:text-xl font-semibold text-blue-300 mb-3 sm:mb-4">Project Details</h2>
              
              <div className="grid grid-cols-1 gap-4">
                {/* Clients */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Clients:
                  </label>
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                    <input
                      id="input-Clients"
                      type="text"
                      className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white"
                      placeholder="Enter client name"
                    />
                    <button
                      onClick={() => handleAddItem('Clients')}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors sm:whitespace-nowrap"
                    >
                      Add
                    </button>
                  </div>
                </div>
                
                {/* Artist Co */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Artist Co:
                  </label>
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                    <input
                      id="input-ArtistCo"
                      type="text"
                      className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white"
                      placeholder="Enter artist company"
                    />
                    <button
                      onClick={() => handleAddItem('ArtistCo')}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors sm:whitespace-nowrap"
                    >
                      Add
                    </button>
                  </div>
                </div>
                
                {/* Workflow Type */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Workflow Type:
                  </label>
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                    <input
                      id="input-WorkflowType"
                      type="text"
                      className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white"
                      placeholder="Enter workflow type"
                    />
                    <button
                      onClick={() => handleAddItem('WorkflowType')}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors sm:whitespace-nowrap"
                    >
                      Add
                    </button>
                  </div>
                </div>
                
                {/* QA Errors */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">
                    QA Errors:
                  </label>
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                    <input
                      id="input-QAErrors"
                      type="text"
                      className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white"
                      placeholder="Enter QA errors"
                    />
                    <button
                      onClick={() => handleAddItem('QAErrors')}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors sm:whitespace-nowrap"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Admin;