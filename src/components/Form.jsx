import React, { useState, useEffect } from 'react';
import FormDesign from '../Design/FormDesign';
import { saveProject, updateProject } from '../services/firebaseService';

function Form({ onClose, projectData }) {
  const [formData, setFormData] = useState({
    sku: '',
    jobType: '',
    assignedUser: '',
    status: '',
    complexity: '',
    hold: '',
    title: '',
    client: '',
    artistCo: '',
    workflowType: '',
    selfserveJobs: false,
    qaErrors: '',
    optionId: '',
    category: [],
    priority: '',
    tag: '',
    dueDate: '',
    imageUrl: ''
  });

  useEffect(() => {
    if (projectData) {
      // Use spread operator to include all possible fields from projectData
      setFormData(prevData => ({
        ...prevData,
        ...projectData,
        // Ensure these specific fields have fallback values
        sku: projectData.sku || '',
        title: projectData.title || '',
        client: projectData.client || '',
        status: projectData.status || '',
        category: projectData.category || [],
        dueDate: projectData.dueDate || '',
        jobType: projectData.jobType || '',
        assignedUser: projectData.assignedUser || '',
        complexity: projectData.complexity || '',
        hold: projectData.hold || '',
        artistCo: projectData.artistCo || '',
        workflowType: projectData.workflowType || '',
        selfserveJobs: projectData.selfserveJobs || false,
        qaErrors: projectData.qaErrors || '',
        optionId: projectData.optionId || '',
        priority: projectData.priority || '',
        tag: projectData.tag || '',
        imageUrl: projectData.imageUrl || ''
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
      const updatedCategories = prevData.category ? [...prevData.category] : [];
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

  const handleFormSubmit = async (validatedFormData) => {
    try {
      if (projectData && projectData.id) {
        // Update existing project - include all fields
        await updateProject(projectData.id, validatedFormData);
      } else {
        // Create new project - include all fields for new entry
        await saveProject(validatedFormData);
      }
      // Close the form and pass the data back to parent
      onClose(validatedFormData);
    } catch (error) {
      console.error('Error saving project:', error);
      alert('Failed to save project. Please try again.');
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
            onSave={handleFormSubmit}
            onCancel={handleCancel}
          />
        </div>
      </div>
    </div>
  );
}

export default Form;