import React, { useEffect, useState } from 'react';
import { getFormOptions, addFormOption } from '../services/firebaseService';

function Admin({ onLogout, token }) {
  const [formOptions, setFormOptions] = useState({
    jobType: [],
    status: [],
    hold: [],
    complexities: [],
    assignedUser: [],
    clients: [],
    artistCo: [],
    workflowType: [],
    qaErrors: [],
    category: [],
    tag: [],
    priority: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Basic token validation
  if (!token) {
    return null;
  }
  
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    const loadFormOptions = () => {
      setLoading(true);
      try {
        getFormOptions((data) => {
          console.log("Admin received data:", data);
          setFormOptions(data);
          setLoading(false);
        });
      } catch (err) {
        console.error("Error loading form options:", err);
        setError("Failed to load options: " + err.message);
        setLoading(false);
      }
    };
    
    loadFormOptions();
  }, []);
  
  // Handle adding new items
  const handleAddItem = async (section) => {
    const inputField = document.getElementById(`input-${section}`);
    if (!inputField || !inputField.value.trim()) return;
    
    const newItem = inputField.value.trim();
    
    try {
      // Add the option to Firebase
      await addFormOption(section, newItem);
      
      // Update local state for immediate UI feedback
      setFormOptions(prev => {
        const updatedOptions = { ...prev };
        if (!updatedOptions[section]) {
          updatedOptions[section] = [newItem];
        } else if (!updatedOptions[section].includes(newItem)) {
          updatedOptions[section] = [...updatedOptions[section], newItem];
        }
        return updatedOptions;
      });
      
      // Clear input
      inputField.value = '';
    } catch (err) {
      console.error(`Error adding ${newItem} to ${section}:`, err);
      alert(`Failed to add item: ${err.message}`);
    }
  };

  if (loading) {
    return <div className="fixed inset-0 bg-gray-900 text-white flex items-center justify-center">Loading form options...</div>;
  }

  if (error) {
    return <div className="fixed inset-0 bg-gray-900 text-white flex items-center justify-center">Error: {error}</div>;
  }

  // Helper function to render option chips
  const renderOptionChips = (options, type) => {
    if (!Array.isArray(options) || options.length === 0) {
      return <p className="text-gray-500 text-sm">No options added yet</p>;
    }
    
    return (
      <div className="flex flex-wrap gap-1 mt-2">
        {options.map((item, index) => (
          <span key={`${type}-${index}`} className="bg-blue-900 text-blue-200 px-2 py-1 rounded text-xs">
            {item}
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-gray-900 text-white overflow-auto">
      <div className="flex flex-col h-full w-full">
        {/* Admin Header */}
        <header className="bg-gray-800 border-b border-blue-700 p-4 sticky top-0 z-10">
          <div className="w-full max-w-6xl mx-auto flex justify-between items-center">
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
        
        {/* Main Content - Scrollable */}
        <main className="flex-grow p-6 w-full overflow-y-auto">
          <div className="w-full max-w-4xl mx-auto bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
            <h1 className="text-2xl font-bold text-blue-400 mb-6 text-center">Admin Panel</h1>
            
            {/* Basic Information Section */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-blue-300 mb-4">Basic Information</h2>
              
              <div className="grid grid-cols-1 gap-6">
                {/* Job Type */}
                <div className="bg-gray-700 p-4 rounded-lg">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Job Type:
                  </label>
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                    <input
                      id="input-jobType"
                      type="text"
                      className="w-full bg-gray-600 border border-gray-500 rounded p-2 text-white"
                      placeholder="Enter job type"
                    />
                    <button
                      onClick={() => handleAddItem('jobType')}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors sm:whitespace-nowrap"
                    >
                      Add
                    </button>
                  </div>
                  {/* <div className="mt-3 p-2 bg-gray-600 rounded">
                    <p className="text-xs text-gray-400 mb-1">Current options:</p>
                    {renderOptionChips(formOptions.jobType, 'jobType')}
                  </div> */}
                </div>
                
                {/* Status */}
                <div className="bg-gray-700 p-4 rounded-lg">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Status:
                  </label>
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                    <input
                      id="input-status"
                      type="text"
                      className="w-full bg-gray-600 border border-gray-500 rounded p-2 text-white"
                      placeholder="Enter status"
                    />
                    <button
                      onClick={() => handleAddItem('status')}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors sm:whitespace-nowrap"
                    >
                      Add
                    </button>
                  </div>
                  {/* <div className="mt-3 p-2 bg-gray-600 rounded">
                    <p className="text-xs text-gray-400 mb-1">Current options:</p>
                    {renderOptionChips(formOptions.status, 'status')}
                  </div> */}
                </div>
                
                {/* Hold */}
                <div className="bg-gray-700 p-4 rounded-lg">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Hold:
                  </label>
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                    <input
                      id="input-hold"
                      type="text"
                      className="w-full bg-gray-600 border border-gray-500 rounded p-2 text-white"
                      placeholder="Enter hold reason"
                    />
                    <button
                      onClick={() => handleAddItem('hold')}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors sm:whitespace-nowrap"
                    >
                      Add
                    </button>
                  </div>
                  {/* <div className="mt-3 p-2 bg-gray-600 rounded">
                    <p className="text-xs text-gray-400 mb-1">Current options:</p>
                    {renderOptionChips(formOptions.hold, 'hold')}
                  </div> */}
                </div>
                
                {/* Complexities */}
                <div className="bg-gray-700 p-4 rounded-lg">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Complexities:
                  </label>
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                    <input
                      id="input-complexities"
                      type="text"
                      className="w-full bg-gray-600 border border-gray-500 rounded p-2 text-white"
                      placeholder="Enter complexity level"
                    />
                    <button
                      onClick={() => handleAddItem('complexities')}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors sm:whitespace-nowrap"
                    >
                      Add
                    </button>
                  </div>
                  {/* <div className="mt-3 p-2 bg-gray-600 rounded">
                    <p className="text-xs text-gray-400 mb-1">Current options:</p>
                    {renderOptionChips(formOptions.complexities, 'complexities')}
                  </div> */}
                </div>
                
                {/* Assigned User */}
                <div className="bg-gray-700 p-4 rounded-lg">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Assigned User:
                  </label>
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                    <input
                      id="input-assignedUser"
                      type="text"
                      className="w-full bg-gray-600 border border-gray-500 rounded p-2 text-white"
                      placeholder="Enter user name"
                    />
                    <button
                      onClick={() => handleAddItem('assignedUser')}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors sm:whitespace-nowrap"
                    >
                      Add
                    </button>
                  </div>
                  {/* <div className="mt-3 p-2 bg-gray-600 rounded">
                    <p className="text-xs text-gray-400 mb-1">Current options:</p>
                    {renderOptionChips(formOptions.assignedUser, 'assignedUser')}
                  </div> */}
                </div>
              </div>
            </div>
            
            {/* Project Details Section */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-blue-300 mb-4">Project Details</h2>
              
              <div className="grid grid-cols-1 gap-6">
                {/* Clients */}
                <div className="bg-gray-700 p-4 rounded-lg">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Clients:
                  </label>
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                    <input
                      id="input-clients"
                      type="text"
                      className="w-full bg-gray-600 border border-gray-500 rounded p-2 text-white"
                      placeholder="Enter client name"
                    />
                    <button
                      onClick={() => handleAddItem('clients')}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors sm:whitespace-nowrap"
                    >
                      Add
                    </button>
                  </div>
                  {/* <div className="mt-3 p-2 bg-gray-600 rounded">
                    <p className="text-xs text-gray-400 mb-1">Current options:</p>
                    {renderOptionChips(formOptions.clients, 'clients')}
                  </div> */}
                </div>
                
                {/* Artist Co */}
                <div className="bg-gray-700 p-4 rounded-lg">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Artist Co:
                  </label>
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                    <input
                      id="input-artistCo"
                      type="text"
                      className="w-full bg-gray-600 border border-gray-500 rounded p-2 text-white"
                      placeholder="Enter artist company"
                    />
                    <button
                      onClick={() => handleAddItem('artistCo')}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors sm:whitespace-nowrap"
                    >
                      Add
                    </button>
                  </div>
                  <div className="mt-3 p-2 bg-gray-600 rounded">
                    <p className="text-xs text-gray-400 mb-1">Current options:</p>
                    {renderOptionChips(formOptions.artistCo, 'artistCo')}
                  </div>
                </div>
                
                {/* Workflow Type */}
                <div className="bg-gray-700 p-4 rounded-lg">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Workflow Type:
                  </label>
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                    <input
                      id="input-workflowType"
                      type="text"
                      className="w-full bg-gray-600 border border-gray-500 rounded p-2 text-white"
                      placeholder="Enter workflow type"
                    />
                    <button
                      onClick={() => handleAddItem('workflowType')}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors sm:whitespace-nowrap"
                    >
                      Add
                    </button>
                  </div>
                  {/* <div className="mt-3 p-2 bg-gray-600 rounded">
                    <p className="text-xs text-gray-400 mb-1">Current options:</p>
                    {renderOptionChips(formOptions.workflowType, 'workflowType')}
                  </div> */}
                </div>
                
                {/* QA Errors */}
                <div className="bg-gray-700 p-4 rounded-lg">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    QA Errors:
                  </label>
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                    <input
                      id="input-qaErrors"
                      type="text"
                      className="w-full bg-gray-600 border border-gray-500 rounded p-2 text-white"
                      placeholder="Enter QA error type"
                    />
                    <button
                      onClick={() => handleAddItem('qaErrors')}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors sm:whitespace-nowrap"
                    >
                      Add
                    </button>
                  </div>
                  {/* <div className="mt-3 p-2 bg-gray-600 rounded">
                    <p className="text-xs text-gray-400 mb-1">Current options:</p>
                    {renderOptionChips(formOptions.qaErrors, 'qaErrors')}
                  </div> */}
                </div>
              </div>
            </div>
            
            {/* Categorization Section */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-blue-300 mb-4">Categorization</h2>
              
              <div className="grid grid-cols-1 gap-6">
                {/* Category */}
                <div className="bg-gray-700 p-4 rounded-lg">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Category:
                  </label>
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                    <input
                      id="input-category"
                      type="text"
                      className="w-full bg-gray-600 border border-gray-500 rounded p-2 text-white"
                      placeholder="Enter category"
                    />
                    <button
                      onClick={() => handleAddItem('category')}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors sm:whitespace-nowrap"
                    >
                      Add
                    </button>
                  </div>
                  {/* <div className="mt-3 p-2 bg-gray-600 rounded">
                    <p className="text-xs text-gray-400 mb-1">Current options:</p>
                    {renderOptionChips(formOptions.category, 'category')}
                  </div> */}
                </div>
                
                {/* Tag */}
                <div className="bg-gray-700 p-4 rounded-lg">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Tag:
                  </label>
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                    <input
                      id="input-tag"
                      type="text"
                      className="w-full bg-gray-600 border border-gray-500 rounded p-2 text-white"
                      placeholder="Enter tag"
                    />
                    <button
                      onClick={() => handleAddItem('tag')}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors sm:whitespace-nowrap"
                    >
                      Add
                    </button>
                  </div>
                  {/* <div className="mt-3 p-2 bg-gray-600 rounded">
                    <p className="text-xs text-gray-400 mb-1">Current options:</p>
                    {renderOptionChips(formOptions.tag, 'tag')}
                  </div> */}
                </div>
                
                {/* Priority */}
                <div className="bg-gray-700 p-4 rounded-lg">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Priority:
                  </label>
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                    <input
                      id="input-priority"
                      type="text"
                      className="w-full bg-gray-600 border border-gray-500 rounded p-2 text-white"
                      placeholder="Enter priority level"
                    />
                    <button
                      onClick={() => handleAddItem('priority')}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors sm:whitespace-nowrap"
                    >
                      Add
                    </button>
                  </div>
                  {/* <div className="mt-3 p-2 bg-gray-600 rounded">
                    <p className="text-xs text-gray-400 mb-1">Current options:</p>
                    {renderOptionChips(formOptions.priority, 'priority')}
                  </div> */}
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