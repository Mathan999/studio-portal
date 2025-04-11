import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Form from '../components/Form';
import DashboardDesign from '../Design/DashboardDesign';

function Dashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState(undefined);
  
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
    // Add any logout logic here
    navigate('/'); // Redirect to login page
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
    // Close mobile menu when form is closed to improve UX
    if (mobileMenuOpen) {
      setMobileMenuOpen(false);
    }
  };

  const handleFormSave = (formData) => {
    console.log('Saved form data:', formData);
    // Here you would handle saving the data to your backend
    setShowForm(false);
    // Close mobile menu when form is saved to improve UX
    if (mobileMenuOpen) {
      setMobileMenuOpen(false);
    }
  };

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