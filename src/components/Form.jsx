import React, { useState, useEffect } from 'react';
import FormDesign from '../Design/FormDesign';

function Form({ onClose, projectData }) {
  // State for form fields
  const [formData, setFormData] = useState({
    // FormDesign fields
    sku: '',
    jobType: 'All',
    assignedUser: 'All',
    status: 'All',
    complexity: 'All',
    hold: 'All',
    title: '',
    client: 'All',
    artistCo: 'All',
    workflowType: 'All',
    selfserveJobs: false,
    qaErrors: 'All',
    optionId: '',
    category: [],
    priority: 'All',
    tag: 'All'
  });

  // Categories for FormDesign
  const [categories] = useState([
    'Gaming Chairs',
    'Gaming Beds',
    'Futons & Sleepers',
    'Furniture Sets',
    'Furniture',
    'Fragrance Oils',
    'Fragrance',
    'Food Prep & Processors',
    'Food',
    'Flush Mount Lighting',
    'Flowers'
  ]);

  // If projectData is provided, use it to populate the form (for editing)
  useEffect(() => {
    if (projectData) {
      setFormData(prevData => ({
        ...prevData,
        // Map any project data to the form fields
        // You may need to adjust this based on your data structure
        sku: projectData.sku || '',
        title: projectData.title || '',
        // Add mappings for other fields as needed
      }));
    }
  }, [projectData]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle category changes
  const handleCategoryChange = (category) => {
    setFormData(prevData => {
      const updatedCategories = [...prevData.category];
      if (updatedCategories.includes(category)) {
        return {
          ...prevData,
          category: updatedCategories.filter(cat => cat !== category)
        };
      } else {
        return {
          ...prevData,
          category: [...updatedCategories, category]
        };
      }
    });
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    // Handle image upload logic here
    console.log("Image uploaded:", e.target.files[0]);
  };

  // Reset filters
  const resetFilters = () => {
    setFormData({
      sku: '',
      jobType: 'All',
      assignedUser: 'All',
      status: 'All',
      complexity: 'All',
      hold: 'All',
      title: '',
      client: 'All',
      artistCo: 'All',
      workflowType: 'All',
      selfserveJobs: false,
      qaErrors: 'All',
      optionId: '',
      category: [],
      priority: 'All',
      tag: 'All'
    });
  };

  // Export CSV
  const exportCsv = () => {
    console.log("Exporting CSV...");
    // Implement CSV export logic here
  };

  // Handle form submission

  // Handle form cancel
  const handleCancel = () => {
    onClose(); // Close without submitting
  };

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-5xl mx-4 border border-blue-700 shadow-xl">
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
        
        <div className="max-h-[70vh] overflow-y-auto">
          <FormDesign 
            formData={formData}
            handleChange={handleChange}
            handleCategoryChange={handleCategoryChange}
            handleImageUpload={handleImageUpload}
            categories={categories}
            resetFilters={resetFilters}
            exportCsv={exportCsv}
          />
        </div>
      </div>
    </div>
  );
}

export default Form;