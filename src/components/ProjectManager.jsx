import React, { useState, useCallback } from 'react';
import FormDesign from './Design/FormDesign'; // Adjust the import path as necessary
import StatsSection from './Design/StatsSection'; // Adjust the import path as necessary

function ProjectManager() {
  // Initial form data
  const [formData, setFormData] = useState({
    sku: '',
    title: '',
    client: '',
    status: '',
    category: [],
    // ... other form fields
  });

  // Project stats state
  const [projectStats, setProjectStats] = useState({
    activeProjects: 0,
    completedProjects: 0,
    pendingReview: 0
  });

  // Handle form field changes
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

  // Handle form save
  const handleSave = (formData) => {
    console.log('Form saved:', formData);
    // Additional save logic here
    
    // Reset form after saving
    setFormData({
      sku: '',
      title: '',
      client: '',
      status: '',
      category: [],
      // ... reset other fields
    });
  };

  // Update project stats
  const updateProjectStats = useCallback((statsUpdate) => {
    setProjectStats(prevStats => ({
      activeProjects: prevStats.activeProjects + (statsUpdate.activeProjects || 0),
      completedProjects: prevStats.completedProjects + (statsUpdate.completedProjects || 0),
      pendingReview: prevStats.pendingReview + (statsUpdate.pendingReview || 0)
    }));
  }, []);

  return (
    <div className="bg-gray-900 min-h-screen">
      {/* Stats Section */}
      <StatsSection projectStats={projectStats} />
      
      {/* Form Design */}
      <FormDesign
        formData={formData}
        handleChange={handleChange}
        handleCategoryChange={handleCategoryChange}
        onSave={handleSave}
        onCancel={() => console.log('Form cancelled')}
        updateProjectStats={updateProjectStats}
      />
    </div>
  );
}

export default ProjectManager;