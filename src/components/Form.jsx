import React, { useState, useEffect } from 'react';

function Form({ onClose, projectData }) {
  // State for form fields
  const [formData, setFormData] = useState({
    projectName: '',
    clientName: '',
    description: '',
    startDate: '',
    dueDate: '',
    status: 'active',
  });

  // If projectData is provided, use it to populate the form (for editing)
  useEffect(() => {
    if (projectData) {
      setFormData({
        projectName: projectData.projectName || '',
        clientName: projectData.clientName || '',
        description: projectData.description || '',
        startDate: projectData.startDate || '',
        dueDate: projectData.dueDate || '',
        status: projectData.status || 'active',
      });
    }
  }, [projectData]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    onClose(formData); // Pass form data back to parent
  };

  // Handle form cancel
  const handleCancel = () => {
    onClose(); // Close without submitting
  };

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl mx-4 border border-blue-700 shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-blue-400">
            {projectData ? 'Edit Project' : 'Add New Project'}
          </h2>
          <button
            onClick={handleCancel}
            className="text-gray-300 hover:text-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="projectName" className="block text-sm font-medium text-gray-300 mb-1">
                Project Name
              </label>
              <input
                type="text"
                id="projectName"
                name="projectName"
                value={formData.projectName}
                onChange={handleChange}
                required
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            
            <div>
              <label htmlFor="clientName" className="block text-sm font-medium text-gray-300 mb-1">
                Client Name
              </label>
              <input
                type="text"
                id="clientName"
                name="clientName"
                value={formData.clientName}
                onChange={handleChange}
                required
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-300 mb-1">
                Start Date
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            
            <div>
              <label htmlFor="dueDate" className="block text-sm font-medium text-gray-300 mb-1">
                Due Date
              </label>
              <input
                type="date"
                id="dueDate"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="status" className="block text-sm font-medium text-gray-300 mb-1">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-blue-500"
            >
              <option value="active">Active</option>
              <option value="pending">Pending Review</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              {projectData ? 'Update Project' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Form;