import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import Form from '../components/Form';
import DashboardDesign from '../Design/DashboardDesign';

function Dashboard({ onLogout }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState(undefined);
  const [authorized, setAuthorized] = useState(true);
  
  // Check authentication on component mount and during navigation
  useEffect(() => {
    const token = sessionStorage.getItem('authToken');
    if (!token) {
      setAuthorized(false);
    }
    
    // Setup protection against session hijacking
    const securityInterval = setInterval(() => {
      const currentToken = sessionStorage.getItem('authToken');
      if (!currentToken) {
        setAuthorized(false);
      }
    }, 5000); // Check every 5 seconds
    
    return () => clearInterval(securityInterval);
  }, []);
    
  // Mock data for dashboard
  const projectStats = {
    activeProjects: 12,
    completedProjects: 24,
    pendingReview: 5
  };
    
  const recentProjects = [
    { id: 1, name: "Neon City Visuals", client: "UrbanFX", status: "In Progress", dueDate: "Apr 20, 2025" },
    { id: 2, name: "Sunset Boulevard Remix", client: "SoundScape", status: "Completed", dueDate: "Apr 5, 2025" },
    { id: 3, name: "Digital Dreams", client: "TechVision", status: "Review", dueDate: "Apr 15, 2025" }
  ];
    
  const handleLogout = () => {
    // Clear any app state here if needed
    // Call the logout function from props
    onLogout();
    // Navigate will happen automatically due to auth state change
  };
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  const handleProjectClick = (projectId) => {
    setSelectedJobId(projectId.toString());
    setShowForm(true);
  };
  
  const handleFormClose = () => {
    setShowForm(false);
    if (mobileMenuOpen) {
      setMobileMenuOpen(false);
    }
  };
  
  const handleFormSave = (formData) => {
    // Process form data here without logging
    // Example of secure handling:
    if (formData && formData.id) {
      // In a real app, you'd save to your backend API
      // No console.log for security
    }
    
    setShowForm(false);
    if (mobileMenuOpen) {
      setMobileMenuOpen(false);
    }
  };
  
  // If authorization check failed, redirect to login
  if (!authorized) {
    return <Navigate to="/login" replace />;
  }
  
  return (
    <>
      <DashboardDesign
        projectStats={projectStats}
        recentProjects={recentProjects}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        handleProjectClick={handleProjectClick}
        handleLogout={handleLogout}
        toggleMobileMenu={toggleMobileMenu}
        mobileMenuOpen={mobileMenuOpen}
      />
            
      {/* Form Modal */}
      {showForm && (
        <Form
          jobId={selectedJobId}
          onClose={handleFormClose}
          onSave={handleFormSave}
        />
      )}
    </>
  );
}

export default Dashboard;