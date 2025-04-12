import React from 'react';

function FormDesign({
  formData,
  handleChange,
  handleCategoryChange,
  categories,
}) {
  // Function to render input fields
  const renderField = (label, name, value, options = ['All']) => (
    <div className="mb-4">
      <label className="block text-blue-100 text-sm font-medium mb-2">{label}:</label>
      <select
        name={name}
        value={value}
        onChange={handleChange}
        className="block w-full bg-black bg-opacity-50 border border-blue-500 text-blue-100 py-2 px-3 rounded leading-tight focus:outline-none focus:bg-black focus:border-blue-400"
      >
        {options.map(option => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="bg-black p-6 min-h-screen">
      <div className="max-w-6xl mx-auto bg-gray-900 rounded-lg shadow-lg shadow-blue-500/20">
        <div className="p-6">
          <h1 className="text-2xl text-blue-400 font-bold mb-6 pb-3 border-b border-blue-900">Item Details</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* First column: Basic Information */}
            <div className="bg-black bg-opacity-40 p-4 rounded-md border border-blue-900">
              <h2 className="text-lg text-blue-300 font-semibold mb-4 pb-2 border-b border-blue-900">Basic Information</h2>
              
              <div className="mb-4">
                <label className="block text-blue-100 text-sm font-medium mb-2">SKU:</label>
                <input
                  type="text"
                  name="sku"
                  value={formData.sku}
                  onChange={handleChange}
                  className="block w-full bg-black bg-opacity-50 border border-blue-500 text-blue-100 py-2 px-3 rounded leading-tight focus:outline-none focus:bg-black focus:border-blue-400"
                  placeholder="Enter SKU"
                />
              </div>

              {renderField('Job Type', 'jobType', formData.jobType)}
              {renderField('Assigned User', 'assignedUser', formData.assignedUser)}
              {renderField('Status', 'status', formData.status)}
              {renderField('Complexities', 'complexity', formData.complexity)}
              {renderField('Hold', 'hold', formData.hold)}
            </div>

            {/* Second column: Project Details */}
            <div className="bg-black bg-opacity-40 p-4 rounded-md border border-blue-900">
              <h2 className="text-lg text-blue-300 font-semibold mb-4 pb-2 border-b border-blue-900">Project Details</h2>
              
              <div className="mb-4">
                <label className="block text-blue-100 text-sm font-medium mb-2">Title:</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="block w-full bg-black bg-opacity-50 border border-blue-500 text-blue-100 py-2 px-3 rounded leading-tight focus:outline-none focus:bg-black focus:border-blue-400"
                  placeholder="Enter Title"
                />
              </div>

              {renderField('Clients', 'client', formData.client)}
              {renderField('Artist Co', 'artistCo', formData.artistCo)}
              {renderField('Workflow Type', 'workflowType', formData.workflowType)}
              
              <div className="mb-4">
                <label className="block text-blue-100 text-sm font-medium mb-2">Selfserve Jobs:</label>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="selfserveJobs"
                    checked={formData.selfserveJobs}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-blue-500 rounded"
                  />
                  <span className="ml-2 text-sm text-blue-100">Enable Selfserve Jobs</span>
                </div>
              </div>

              {renderField('QA Errors', 'qaErrors', formData.qaErrors)}
            </div>

            {/* Third column: Additional Options */}
            <div className="bg-black bg-opacity-40 p-4 rounded-md border border-blue-900">
              <h2 className="text-lg text-blue-300 font-semibold mb-4 pb-2 border-b border-blue-900">Additional Options</h2>
              
              <div className="mb-4">
                <label className="block text-blue-100 text-sm font-medium mb-2">Option ID:</label>
                <input
                  type="text"
                  name="optionId"
                  value={formData.optionId}
                  onChange={handleChange}
                  className="block w-full bg-black bg-opacity-50 border border-blue-500 text-blue-100 py-2 px-3 rounded leading-tight focus:outline-none focus:bg-black focus:border-blue-400"
                  placeholder="Enter Option ID"
                />
              </div>

              <div className="mb-4">
                <label className="block text-blue-100 text-sm font-medium mb-2">Category:</label>
                <div className="bg-black bg-opacity-50 border border-blue-500 rounded p-2 max-h-32 overflow-y-auto">
                  {categories.map(category => (
                    <div key={category} className="flex items-center mb-1">
                      <input
                        type="checkbox"
                        id={`category-${category}`}
                        checked={formData.category.includes(category)}
                        onChange={() => handleCategoryChange(category)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-blue-500 rounded"
                      />
                      <label htmlFor={`category-${category}`} className="ml-2 text-sm text-blue-100">
                        {category}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-blue-100 text-sm font-medium mb-2">Tag:</label>
                <input
                  type="text"
                  name="tag"
                  value={formData.tag || ''}
                  onChange={handleChange}
                  className="block w-full bg-black bg-opacity-50 border border-blue-500 text-blue-100 py-2 px-3 rounded leading-tight focus:outline-none focus:bg-black focus:border-blue-400"
                  placeholder="Enter Tag"
                />
              </div>

              <div className="mb-4">
                <label className="block text-blue-100 text-sm font-medium mb-2">Due Date:</label>
                <input
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleChange}
                  className="block w-full bg-black bg-opacity-50 border border-blue-500 text-blue-100 py-2 px-3 rounded leading-tight focus:outline-none focus:bg-black focus:border-blue-400"
                />
              </div>

              {renderField('Priority', 'priority', formData.priority)}
            </div>
          </div>
          
          <div className="mt-6 flex justify-end space-x-4">
            <button 
              className="px-4 py-2 bg-gray-800 text-blue-100 rounded hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors"
            >
              Cancel
            </button>
            <button 
              className="px-4 py-2 bg-blue-600 text-blue-50 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FormDesign;