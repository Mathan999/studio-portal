import React, { useState, useEffect } from 'react';
import FormDesign from '../Design/FormDesign';
import { saveProject } from '../services/firebaseService'; // Import Firebase service

function Form({ onClose, projectData }) {
  const [formData, setFormData] = useState({
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
    tag: 'All',
    dueDate: ''
  });

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

  useEffect(() => {
    if (projectData) {
      setFormData(prevData => ({
        ...prevData,
        sku: projectData.sku || '',
        title: projectData.title || '',
        client: projectData.client || 'All',
        status: projectData.status || 'All',
        category: projectData.category || [],
        dueDate: projectData.dueDate || '',
        jobType: projectData.jobType || 'All',
        assignedUser: projectData.assignedUser || 'All',
        complexity: projectData.complexity || 'All',
        hold: projectData.hold || 'All',
        artistCo: projectData.artistCo || 'All',
        workflowType: projectData.workflowType || 'All',
        selfserveJobs: projectData.selfserveJobs || false,
        qaErrors: projectData.qaErrors || 'All',
        optionId: projectData.optionId || '',
        priority: projectData.priority || 'All',
        tag: projectData.tag || 'All'
      }));
    }
  }, [projectData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

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

  const handleImageUpload = (e) => {
    console.log("Image uploaded:", e.target.files[0]);
  };

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
      tag: 'All',
      dueDate: ''
    });
  };

  const exportCsv = () => {
    console.log("Exporting CSV...");
  };

  const handleSave = async (data) => {
    try {
      await saveProject(data);
      onClose(data); // Pass data back to DashboardDesign
    } catch (error) {
      console.error('Failed to save project:', error);
    }
  };

  const handleCancel = () => {
    onClose();
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
            onSave={handleSave}
            onCancel={handleCancel}
          />
        </div>
      </div>
    </div>
  );
}

export default Form;