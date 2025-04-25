import React, { useState } from 'react';
import FormDesign from '../Design/FormDesign';
import StatsSection from '../Design/StatsSection'; // Ensure the path is correct

function ProjectDashboard() {
  // Initial form data state
  const [formData, setFormData] = useState({
    sku: '',
    title: '',
    client: '',
    status: '',
    jobType: '',
    assignedUser: '',
    complexity: '',
    hold: '',
    artistCo: '',
    workflowType: '',
    selfserveJobs: false,
    qaErrors: '',
    optionId: '',
    category: [],
    tag: '',
    dueDate: '',
    priority: ''
  });
  
  // Initial project stats state
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

  // Handle category selection changes
  const handleCategoryChange = (category) => {
    setFormData(prevData => {
      const currentCategories = prevData.category || [];
      if (currentCategories.includes(category)) {
        return {
          ...prevData,
          category: currentCategories.filter(cat => cat !== category)
        };
      } else {
        return {
          ...prevData,
          category: [...currentCategories, category]
        };
      }
    });
  };

  // Handle form save
  const handleSave = (formData) => {
    console.log('Form saved:', formData);
    // Here you would typically send the data to your backend
    // Reset the form after saving if needed
    setFormData({
      sku: '',
      title: '',
      client: '',
      status: '',
      jobType: '',
      assignedUser: '',
      complexity: '',
      hold: '',
      artistCo: '',
      workflowType: '',
      selfserveJobs: false,
      qaErrors: '',
      optionId: '',
      category: [],
      tag: '',
      dueDate: '',
      priority: ''
    });
  };

  // Handle form cancel
  const handleCancel = () => {
    console.log('Form cancelled');
    // Reset the form
    setFormData({
      sku: '',
      title: '',
      client: '',
      status: '',
      jobType: '',
      assignedUser: '',
      complexity: '',
      hold: '',
      artistCo: '',
      workflowType: '',
      selfserveJobs: false,
      qaErrors: '',
      optionId: '',
      category: [],
      tag: '',
      dueDate: '',
      priority: ''
    });
  };

  // Update project stats
  const updateProjectStats = (stats) => {
    setProjectStats(prevStats => ({
      activeProjects: prevStats.activeProjects + stats.activeProjects,
      completedProjects: prevStats.completedProjects + stats.completedProjects,
      pendingReview: prevStats.pendingReview + stats.pendingReview
    }));
  };

  return (
    <div className="bg-gray-900 min-h-screen">
      {/* Display stats at the top */}
      <StatsSection projectStats={projectStats} />
      
      {/* Form design below stats */}
      <FormDesign
        formData={formData}
        handleChange={handleChange}
        handleCategoryChange={handleCategoryChange}
        onSave={handleSave}
        onCancel={handleCancel}
        updateProjectStats={updateProjectStats}
      />
    </div>
  );
}

export default ProjectDashboard;