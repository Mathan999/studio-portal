import React from 'react';

function FormDesign({
  formData,
  handleChange,
  handleCategoryChange,
  handleImageUpload,
  categories}) {
  // Function to render input fields
  const renderField = (label, name, value, options = ['All']) => (
    <div className="mb-4">
      <label className="block text-gray-300 text-sm font-medium mb-2">{label}:</label>
      <select
        name={name}
        value={value}
        onChange={handleChange}
        className="block w-full bg-gray-700 border border-gray-600 text-gray-300 py-2 px-3 rounded leading-tight focus:outline-none focus:bg-gray-600 focus:border-blue-500"
      >
        {options.map(option => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h1 className="text-xl text-gray-100 font-bold mb-6 border-b border-gray-600 pb-3">Item Details</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* First column */}
        <div className="bg-gray-750 p-4 rounded-md">
          <div className="mb-4">
            <label className="block text-gray-300 text-sm font-medium mb-2">SKU:</label>
            <input
              type="text"
              name="sku"
              value={formData.sku}
              onChange={handleChange}
              className="block w-full bg-gray-700 border border-gray-600 text-gray-300 py-2 px-3 rounded leading-tight focus:outline-none focus:bg-gray-600 focus:border-blue-500"
              placeholder="Enter SKU"
            />
          </div>

          {renderField('Job Type', 'jobType', formData.jobType)}
          {renderField('Assigned User', 'assignedUser', formData.assignedUser)}
          {renderField('Status', 'status', formData.status)}
          {renderField('Complexities', 'complexity', formData.complexity)}
          {renderField('Hold', 'hold', formData.hold)}
        </div>

        {/* Second column */}
        <div className="bg-gray-750 p-4 rounded-md">
          <div className="mb-4">
            <label className="block text-gray-300 text-sm font-medium mb-2">Title:</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="block w-full bg-gray-700 border border-gray-600 text-gray-300 py-2 px-3 rounded leading-tight focus:outline-none focus:bg-gray-600 focus:border-blue-500"
              placeholder="Enter Title"
            />
          </div>

          {renderField('Clients', 'client', formData.client)}
          {renderField('Artist Co', 'artistCo', formData.artistCo)}
          {renderField('Workflow Type', 'workflowType', formData.workflowType)}
          
          <div className="mb-4">
            <label className="block text-gray-300 text-sm font-medium mb-2">Selfserve Jobs:</label>
            <div className="flex items-center">
              <input
                type="checkbox"
                name="selfserveJobs"
                checked={formData.selfserveJobs}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 rounded"
              />
              <span className="ml-2 text-sm text-gray-300">Enable Selfserve Jobs</span>
            </div>
          </div>

          {renderField('QA Errors', 'qaErrors', formData.qaErrors)}
        </div>

        {/* Third column */}
        <div className="bg-gray-750 p-4 rounded-md">
          <div className="mb-4">
            <label className="block text-gray-300 text-sm font-medium mb-2">Option ID:</label>
            <input
              type="text"
              name="optionId"
              value={formData.optionId}
              onChange={handleChange}
              className="block w-full bg-gray-700 border border-gray-600 text-gray-300 py-2 px-3 rounded leading-tight focus:outline-none focus:bg-gray-600 focus:border-blue-500"
              placeholder="Enter Option ID"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-300 text-sm font-medium mb-2">Category:</label>
            <div className="bg-gray-700 border border-gray-600 rounded p-2 max-h-32 overflow-y-auto">
              {categories.map(category => (
                <div key={category} className="flex items-center mb-1">
                  <input
                    type="checkbox"
                    id={`category-${category}`}
                    checked={formData.category.includes(category)}
                    onChange={() => handleCategoryChange(category)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 rounded"
                  />
                  <label htmlFor={`category-${category}`} className="ml-2 text-sm text-gray-300">
                    {category}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-300 text-sm font-medium mb-2">Due Date:</label>
            <input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              className="block w-full bg-gray-700 border border-gray-600 text-gray-300 py-2 px-3 rounded leading-tight focus:outline-none focus:bg-gray-600 focus:border-blue-500"
            />
          </div>

          {renderField('Priority', 'priority', formData.priority)}

          <div className="mb-4">
            <label className="block text-gray-300 text-sm font-medium mb-2">Image Upload:</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
            />
          </div>
        </div>
      </div>
      
      <div className="mt-6 flex justify-end space-x-4">
        <button 
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
        >
          Cancel
        </button>
        <button 
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Save
        </button>
      </div>
    </div>
  );
}

export default FormDesign;