import React, { useState, useEffect } from 'react';
import { getFormOptions, deleteFormOption } from '../services/firebaseService';

function FormDesign({
  formData,
  handleChange,
  handleCategoryChange,
  onSave,
  onCancel,
}) {
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
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
  const [imagePreview, setImagePreview] = useState(null);

  const requiredFields = ['sku', 'title', 'client', 'status'];

  // Fetch options from Firebase
  useEffect(() => {
    const fetchOptions = () => {
      getFormOptions((data) => {
        console.log("Fetched form options:", data);
        setFormOptions(data || {});
      });
    };
    
    fetchOptions();
    
    // Set up a refresh interval to keep the options updated
    const intervalId = setInterval(fetchOptions, 5000);
    
    return () => clearInterval(intervalId);
  }, []);

  // Set image preview when imageUrl changes
  useEffect(() => {
    if (formData.imageUrl) {
      setImagePreview(formData.imageUrl);
    } else {
      setImagePreview(null);
    }
  }, [formData.imageUrl]);

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
    
    // Validate imageUrl format if provided
    if (formData.imageUrl && !isValidUrl(formData.imageUrl)) {
      newErrors.imageUrl = 'Please enter a valid URL';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    // eslint-disable-next-line no-unused-vars
    } catch (_) {
      return false;
    }
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

  // Handler to delete an option from a dropdown list
  const handleDeleteOption = (optionType, optionValue) => {
    // First update the local state immediately for responsive UI
    setFormOptions(prevOptions => {
      // Check if prevOptions[optionType] exists before filtering
      const optionArray = prevOptions[optionType] || [];
      
      const updatedOptions = {
        ...prevOptions,
        [optionType]: optionArray.filter(opt => opt !== optionValue)
      };
      return updatedOptions;
    });

    // If selected option is being deleted, reset the form value
    if (formData[optionType] === optionValue) {
      handleChange({
        target: {
          name: optionType,
          value: ''
        }
      });
    }

    // Then update in Firebase
    deleteFormOption(optionType, optionValue);
  };

  // Handler to delete a category from the category list
  const handleDeleteCategory = (categoryValue) => {
    // Update local state
    setFormOptions(prevOptions => {
      // Check if prevOptions.category exists before filtering
      const categoryArray = prevOptions.category || [];
      
      const updatedOptions = {
        ...prevOptions,
        category: categoryArray.filter(cat => cat !== categoryValue)
      };
      return updatedOptions;
    });

    // If the deleted category is selected, remove it from selection
    if (formData.category && formData.category.includes(categoryValue)) {
      const updatedCategories = formData.category.filter(cat => cat !== categoryValue);
      handleChange({
        target: {
          name: 'category',
          value: updatedCategories
        }
      });
    }

    // Update in Firebase
    deleteFormOption('category', categoryValue);
  };

  const renderField = (label, name, value, options) => (
    <div className="mb-4">
      <label className={`block text-sm font-medium mb-2 ${requiredFields.includes(name) ? 'text-blue-100 after:content-["*"] after:ml-0.5 after:text-red-400' : 'text-blue-100'}`}>
        {label}:
      </label>
      <div className="relative">
        <select
          name={name}
          value={value || ''}
          onChange={handleChange}
          className={`block w-full bg-black bg-opacity-50 border ${errors[name] ? 'border-red-400' : 'border-blue-500'} text-blue-100 py-2 px-3 rounded leading-tight focus:outline-none focus:bg-black focus:border-blue-400 pr-10`}
        >
          <option value="">Select {label}</option>
          {Array.isArray(options) && options.map((option, index) => (
            <option key={`${option}-${index}`} value={option}>{option}</option>
          ))}
        </select>
        
        {/* Delete button inside dropdown, matching your image */}
        <button
          type="button"
          className="absolute right-2 top-2 text-blue-300 hover:text-blue-100 focus:outline-none"
          onClick={() => {
            if (value) {
              handleDeleteOption(name, value);
            }
          }}
          disabled={!value}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
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

  // New function to render image URL input with preview
  const renderImageUrlInput = () => (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-2 text-blue-100">
        Image URL (Cloudinary):
      </label>
      <div className="flex flex-col space-y-2">
        <input
          type="text"
          name="imageUrl"
          value={formData.imageUrl || ''}
          onChange={handleChange}
          className={`block w-full bg-black bg-opacity-50 border ${errors.imageUrl ? 'border-red-400' : 'border-blue-500'} text-blue-100 py-2 px-3 rounded leading-tight focus:outline-none focus:bg-black focus:border-blue-400`}
          placeholder="Enter Cloudinary Image URL"
        />
        
        {formData.imageUrl && (
          <div className="relative">
            <button
              type="button"
              onClick={() => handleChange({ target: { name: 'imageUrl', value: '' } })}
              className="absolute right-2 top-2 text-blue-300 hover:text-blue-100 focus:outline-none bg-black bg-opacity-50 rounded-full p-1"
              aria-label="Clear image URL"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </button>
            <div className="mt-2 border border-blue-900 rounded-md overflow-hidden">
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Project thumbnail"
                  className="w-full h-32 object-cover"
                  onError={() => setImagePreview(null)}
                />
              )}
              {!imagePreview && formData.imageUrl && (
                <div className="w-full h-32 bg-gray-900 flex items-center justify-center text-blue-300 text-sm">
                  Unable to load image preview
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      {errors.imageUrl && (
        <p className="text-red-400 text-xs mt-1 error-message">{errors.imageUrl}</p>
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
                {renderField('Job Type', 'jobType', formData.jobType, formOptions.jobType)}
                {renderField('Assigned User', 'assignedUser', formData.assignedUser, formOptions.assignedUser)}
                {renderField('Status', 'status', formData.status, formOptions.status)}
                {renderField('Complexities', 'complexity', formData.complexity, formOptions.complexities)}
                {renderField('Hold', 'hold', formData.hold, formOptions.hold)}
              </div>

              <div className="bg-black bg-opacity-40 p-4 rounded-md border border-blue-900">
                <h2 className="text-lg text-blue-300 font-semibold mb-4 pb-2 border-b border-blue-900">Project Details</h2>
                
                {renderTextInput('Title', 'title', formData.title, 'Enter Title')}
                {renderField('Clients', 'client', formData.client, formOptions.clients)}
                {renderField('Artist Co', 'artistCo', formData.artistCo, formOptions.artistCo)}
                {renderField('Workflow Type', 'workflowType', formData.workflowType, formOptions.workflowType)}
                
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

                {renderField('QA Errors', 'qaErrors', formData.qaErrors, formOptions.qaErrors)}
              </div>

              <div className="bg-black bg-opacity-40 p-4 rounded-md border border-blue-900">
                <h2 className="text-lg text-blue-300 font-semibold mb-4 pb-2 border-b border-blue-900">Additional Options</h2>
                
                {renderTextInput('Option ID', 'optionId', formData.optionId, 'Enter Option ID')}

                <div className="mb-4">
                  <label className="block text-blue-100 text-sm font-medium mb-2">Category:</label>
                  <div className={`bg-black bg-opacity-50 border ${errors.category ? 'border-red-400' : 'border-blue-500'} rounded p-2 max-h-32 overflow-y-auto`}>
                    {Array.isArray(formOptions.category) && formOptions.category.map((category, index) => (
                      <div key={`cat-${index}`} className="flex items-center mb-1 justify-between">
                        <div className="flex items-center">
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
                        <button
                          type="button"
                          onClick={() => handleDeleteCategory(category)}
                          className="text-blue-300 hover:text-blue-100"
                          aria-label={`Delete ${category} category`}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                        </button>
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
                  <div className="relative">
                    <input
                      type="date"
                      name="dueDate"
                      value={formData.dueDate || ''}
                      onChange={handleChange}
                      className={`block w-full bg-black bg-opacity-50 border ${errors.dueDate ? 'border-red-400' : 'border-blue-500'} text-blue-100 py-2 px-3 rounded leading-tight focus:outline-none focus:bg-black focus:border-blue-400 pr-10`}
                    />
                    {formData.dueDate && (
                      <button
                        type="button"
                        onClick={() => handleChange({ target: { name: 'dueDate', value: '' } })}
                        className="absolute right-2 top-2 text-blue-300 hover:text-blue-100 focus:outline-none"
                        aria-label="Clear due date"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      </button>
                    )}
                  </div>
                  {errors.dueDate && (
                    <p className="text-red-400 text-xs mt-1 error-message">{errors.dueDate}</p>
                  )}
                </div>

                {renderField('Priority', 'priority', formData.priority, formOptions.priority)}
                
                {/* Add the new image URL input field */}
                {renderImageUrlInput()}
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