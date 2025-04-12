import React, { useState, useEffect } from 'react';

function FormDesign({
  formData,
  handleChange,
  handleCategoryChange,
  categories,
  onSave,
  onCancel
}) {
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const requiredFields = ['sku', 'title', 'client', 'status'];

  useEffect(() => {
    if (isSubmitted) {
      validateForm();
    }
  }, [formData, isSubmitted]);

  const validateForm = () => {
    const newErrors = {};
    
    requiredFields.forEach(field => {
      if (!formData[field] || formData[field].trim() === '' || formData[field] === 'gamel') {
        newErrors[field] = 'This field is required';
      }
    });
    
    if (formData.sku && !/^[a-zA-Z0-9-]+$/.test(formData.sku)) {
      newErrors.sku = 'SKU must contain only letters, numbers, and hyphens';
    }
    
    if (formData.dueDate) {
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);
      
      const selectedDate = new Date(formData.dueDate);
      if (selectedDate < currentDate) {
        newErrors.dueDate = 'Due date cannot be in the past';
      }
    }
    
    if (formData.category && formData.category.length === 0) {
      newErrors.category = 'Select at least one category';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    
    const isValid = validateForm();
    if (isValid) {
      onSave(formData);
    } else {
      const firstErrorField = document.querySelector('.error-message');
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  const renderField = (label, name, value, options = ['Super']) => (
    <div className="mb-4">
      <label className={`block text-sm font-medium mb-2 ${requiredFields.includes(name) ? 'text-blue-100 after:content-["*"] after:ml-0.5 after:text-red-400' : 'text-blue-100'}`}>
        {label}:
      </label>
      <select
        name={name}
        value={value || 'All'}
        onChange={handleChange}
        className={`block w-full bg-black bg-opacity-50 border ${errors[name] ? 'border-red-400' : 'border-blue-500'} text-blue-100 py-2 px-3 rounded leading-tight focus:outline-none focus:bg-black focus:border-blue-400`}
      >
        <option value="All">Select {label}</option>
        {options.map(option => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
      {errors[name] && (
        <p className="text-red-400 text-xs mt-1 error-message">{errors[name]}</p>
      )}
    </div>
  );

  const renderTextInput = (label, name, value, placeholder) => (
    <div className="mb-4">
      <label className={`block text-sm font-medium mb-2 ${requiredFields.includes(name) ? 'text-blue-100 after:content-["*"] after:ml-0.5 after:text-red-400' : 'text-blue-100'}`}>
        {label}:
      </label>
      <input
        type="text"
        name={name}
        value={value || ''}
        onChange={handleChange}
        className={`block w-full bg-black bg-opacity-50 border ${errors[name] ? 'border-red-400' : 'border-blue-500'} text-blue-100 py-2 px-3 rounded leading-tight focus:outline-none focus:bg-black focus:border-blue-400`}
        placeholder={placeholder}
      />
      {errors[name] && (
        <p className="text-red-400 text-xs mt-1 error-message">{errors[name]}</p>
      )}
    </div>
  );

  return (
    <div className="bg-black p-6 min-h-screen">
      <div className="max-w-6xl mx-auto bg-gray-900 rounded-lg shadow-lg shadow-blue-500/20">
        <form onSubmit={handleSubmit}>
          <div className="p-6">
            <h1 className="text-2xl text-blue-400 font-bold mb-6 pb-3 border-b border-blue-900">Item Details</h1>
            
            {isSubmitted && Object.keys(errors).length > 0 && (
              <div className="mb-6 p-4 bg-red-900 bg-opacity-30 border border-red-500 rounded-md">
                <p className="text-red-300 font-medium">Please correct the following errors:</p>
                <ul className="list-disc pl-5 mt-2">
                  {Object.keys(errors).map(field => (
                    <li key={field} className="text-red-200 text-sm">{errors[field]}</li>
                  ))}
                </ul>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-black bg-opacity-40 p-4 rounded-md border border-blue-900">
                <h2 className="text-lg text-blue-300 font-semibold mb-4 pb-2 border-b border-blue-900">Basic Information</h2>
                
                {renderTextInput('SKU', 'sku', formData.sku, 'Enter SKU')}
                {renderField('Job Type', 'jobType', formData.jobType)}
                {renderField('Assigned User', 'assignedUser', formData.assignedUser)}
                {renderField('Status', 'status', formData.status)}
                {renderField('Complexities', 'complexity', formData.complexity)}
                {renderField('Hold', 'hold', formData.hold)}
              </div>

              <div className="bg-black bg-opacity-40 p-4 rounded-md border border-blue-900">
                <h2 className="text-lg text-blue-300 font-semibold mb-4 pb-2 border-b border-blue-900">Project Details</h2>
                
                {renderTextInput('Title', 'title', formData.title, 'Enter Title')}
                {renderField('Clients', 'client', formData.client)}
                {renderField('Artist Co', 'artistCo', formData.artistCo)}
                {renderField('Workflow Type', 'workflowType', formData.workflowType)}
                
                <div className="mb-4">
                  <label className="block text-blue-100 text-sm font-medium mb-2">Selfserve Jobs:</label>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="selfserveJobs"
                      checked={formData.selfserveJobs || false}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-blue-500 rounded"
                    />
                    <span className="ml-2 text-sm text-blue-100">Enable Selfserve Jobs</span>
                  </div>
                </div>

                {renderField('QA Errors', 'qaErrors', formData.qaErrors)}
              </div>

              <div className="bg-black bg-opacity-40 p-4 rounded-md border border-blue-900">
                <h2 className="text-lg text-blue-300 font-semibold mb-4 pb-2 border-b border-blue-900">Additional Options</h2>
                
                {renderTextInput('Option ID', 'optionId', formData.optionId, 'Enter Option ID')}

                <div className="mb-4">
                  <label className="block text-blue-100 text-sm font-medium mb-2">Category:</label>
                  <div className={`bg-black bg-opacity-50 border ${errors.category ? 'border-red-400' : 'border-blue-500'} rounded p-2 max-h-32 overflow-y-auto`}>
                    {categories.map(category => (
                      <div key={category} className="flex items-center mb-1">
                        <input
                          type="checkbox"
                          id={`category-${category}`}
                          checked={formData.category?.includes(category) || false}
                          onChange={() => handleCategoryChange(category)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-blue-500 rounded"
                        />
                        <label htmlFor={`category-${category}`} className="ml-2 text-sm text-blue-100">
                          {category}
                        </label>
                      </div>
                    ))}
                  </div>
                  {errors.category && (
                    <p className="text-red-400 text-xs mt-1 error-message">{errors.category}</p>
                  )}
                </div>

                {renderTextInput('Tag', 'tag', formData.tag, 'Enter Tag')}

                <div className="mb-4">
                  <label className="block text-blue-100 text-sm font-medium mb-2">Due Date:</label>
                  <input
                    type="date"
                    name="dueDate"
                    value={formData.dueDate || ''}
                    onChange={handleChange}
                    className={`block w-full bg-black bg-opacity-50 border ${errors.dueDate ? 'border-red-400' : 'border-blue-500'} text-blue-100 py-2 px-3 rounded leading-tight focus:outline-none focus:bg-black focus:border-blue-400`}
                  />
                  {errors.dueDate && (
                    <p className="text-red-400 text-xs mt-1 error-message">{errors.dueDate}</p>
                  )}
                </div>

                {renderField('Priority', 'priority', formData.priority)}
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-4">
              <button 
                type="button"
                onClick={onCancel}
                className="px-4 py-2 bg-gray-800 text-blue-100 rounded hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="px-4 py-2 bg-blue-600 text-blue-50 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default FormDesign;