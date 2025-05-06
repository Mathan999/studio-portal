import React, { useState, useEffect } from 'react';
import Form from '../components/Form'; // Ensure path is correct
import { fetchProjects } from '../services/firebaseService'; // Import Firebase service
import Admin from '../components/Admin'; // Import Admin component
import StatsSection from '../Design/StatsSection'; // Import our new StatsSection component
import DashForm from '../components/DashForm'; // Import FormDash component
import ImageCorr from '../components/ImageCorr'; // Import Correction component - uncommented this line

function DashboardDesign({
  projectStats,
  activeTab,
  setActiveTab,
  handleLogout,
  toggleMobileMenu,
  mobileMenuOpen
}) {
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [editingProject] = useState(null);
  const [projects, setProjects] = useState([]); // State for projects
  const [, setIsLoading] = useState(true);
  // eslint-disable-next-line no-empty-pattern
  const [] = useState('');

  // Fetch projects from Firebase
  useEffect(() => {
    const unsubscribe = fetchProjects((projectsData) => {
      setProjects(projectsData);
      setIsLoading(false);
    });
    
    // Cleanup subscription on unmount
    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);


  const handleFormClose = async (formData) => {
    setShowProjectForm(false);
    if (formData) {
      try {
        console.log('Form submitted with data:', formData);
        
        // Get fresh data from Firebase after form submission
        // This ensures we're seeing the latest data including our changes
        const refreshData = await fetchProjects((projectsData) => {
          setProjects(projectsData);
        });
        
        // Display success message
        if (!editingProject) {
          alert('Project successfully created');
        } else {
          alert('Project successfully updated');
        }
        
        return refreshData;
      } catch (error) {
        console.error('Error handling form submission:', error);
        alert('Error: ' + error.message);
      }
    }
  };

  // Dummy token for Admin component - replace with actual token logic
  const adminToken = "admin-token";

  // Handle admin logout separately
  const handleAdminLogout = () => {
    // You might want to handle this differently than regular logout
    handleLogout();
  };

  return (
    <div className="fixed inset-0 bg-gray-900">
      <div className="flex h-screen">
        <aside className={`fixed inset-y-0 left-0 z-30 transform ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 ease-in-out w-64 bg-gray-800 border-r border-blue-700 flex flex-col`}>
          <div className="p-4 border-b border-blue-700 flex justify-between items-center">
            <h1 className="text-xl md:text-2xl font-bold text-blue-400">STUDIO 32</h1>
            <button 
              className="lg:hidden text-gray-300 hover:text-white"
              onClick={toggleMobileMenu}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <nav className="flex-1 overflow-y-auto py-2 bg-gray-800">
            <div className="flex flex-col h-full">
              {/* Each nav item has a fixed position with a left border that's always present but only visible when active */}
              <div className={`relative ${activeTab === 'overview' ? 'bg-gray-700' : 'hover:bg-gray-700'}`}>
                {/* This creates a fixed left border spacing to ensure text alignment consistency */}
                <div className="absolute top-0 left-0 h-full w-1 border-l-4 border-transparent"></div>
                {/* This shows the blue border when active, positioned exactly where the transparent one is */}
                {activeTab === 'overview' && <div className="absolute top-0 left-0 h-full w-1 border-l-4 border-blue-400"></div>}
                <button 
                  className="w-full text-left px-6 py-3 font-medium text-gray-300 hover:text-gray-100"
                  onClick={() => setActiveTab('overview')}
                >
                  Overview
                </button>
              </div>
              
              <div className={`relative ${activeTab === 'projects' ? 'bg-gray-700' : 'hover:bg-gray-700'}`}>
                <div className="absolute top-0 left-0 h-full w-1 border-l-4 border-transparent"></div>
                {activeTab === 'projects' && <div className="absolute top-0 left-0 h-full w-1 border-l-4 border-blue-400"></div>}
                <button 
                  className="w-full text-left px-6 py-3 font-medium text-gray-300 hover:text-gray-100"
                  onClick={() => setActiveTab('projects')}
                >
                  Projects
                </button>
              </div>
              
              <div className={`relative ${activeTab === 'clients' ? 'bg-gray-700' : 'hover:bg-gray-700'}`}>
                <div className="absolute top-0 left-0 h-full w-1 border-l-4 border-transparent"></div>
                {activeTab === 'clients' && <div className="absolute top-0 left-0 h-full w-1 border-l-4 border-blue-400"></div>}
                <button 
                  className="w-full text-left px-6 py-3 font-medium text-gray-300 hover:text-gray-100"
                  onClick={() => setActiveTab('clients')}
                >
                  Clients
                </button>
              </div>
              
              <div className={`relative ${activeTab === 'settings' ? 'bg-gray-700' : 'hover:bg-gray-700'}`}>
                <div className="absolute top-0 left-0 h-full w-1 border-l-4 border-transparent"></div>
                {activeTab === 'settings' && <div className="absolute top-0 left-0 h-full w-1 border-l-4 border-blue-400"></div>}
                <button 
                  className="w-full text-left px-6 py-3 font-medium text-gray-300 hover:text-gray-100"
                  onClick={() => setActiveTab('settings')}
                >
                  Settings
                </button>
              </div>
              
              <div className={`relative ${activeTab === 'correction' ? 'bg-gray-700' : 'hover:bg-gray-700'}`}>
                <div className="absolute top-0 left-0 h-full w-1 border-l-4 border-transparent"></div>
                {activeTab === 'correction' && <div className="absolute top-0 left-0 h-full w-1 border-l-4 border-blue-400"></div>}
                <button 
                  className="w-full text-left px-6 py-3 font-medium text-gray-300 hover:text-gray-100"
                  onClick={() => setActiveTab('correction')}
                >
                Correction
                </button>
              </div>
              
              <div className="relative hover:bg-gray-700">
                <div className="absolute top-0 left-0 h-full w-1 border-l-4 border-transparent"></div>
                <button 
                  className="w-full text-left px-6 py-3 font-medium text-gray-300 hover:text-gray-100"
                >
                  Analytics
                </button>
              </div>
              
              <div className="relative hover:bg-gray-700">
                <div className="absolute top-0 left-0 h-full w-1 border-l-4 border-transparent"></div>
                <button 
                  className="w-full text-left px-6 py-3 font-medium text-gray-300 hover:text-gray-100"
                >
                  Documents
                </button>
              </div>
              
              <div className="relative hover:bg-gray-700">
                <div className="absolute top-0 left-0 h-full w-1 border-l-4 border-transparent"></div>
                <button 
                  className="w-full text-left px-6 py-3 font-medium text-gray-300 hover:text-gray-100"
                >
                  Messages
                </button>
              </div>
              
              <div className="flex-grow"></div>
            </div>
          </nav>
          
          <div className="p-4 border-t border-gray-700">
            <div className="text-gray-300 mb-2">Welcome, studio32</div>
            <button 
              onClick={handleLogout}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Logout
            </button>
          </div>
        </aside>
        
        <div className="flex-1 lg:ml-64 flex flex-col w-full">
          <header className="fixed top-0 right-0 left-0 lg:left-64 z-20 bg-gray-800 border-b border-blue-700 shadow-md">
            <div className="px-4 py-4 flex justify-between items-center">
              <button 
                className="lg:hidden text-gray-300 hover:text-white focus:outline-none"
                onClick={toggleMobileMenu}
                aria-label="Toggle menu"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              
              <h2 className="text-lg sm:text-xl font-medium text-gray-300">
                {activeTab === 'overview' ? 'Dashboard' : 
                 activeTab === 'projects' ? 'Projects' : 
                 activeTab === 'clients' ? 'Client Dashboard' : 
                 activeTab === 'settings' ? 'Admin Panel' : 
                 activeTab === 'correction' ? 'Proofing' : 'Dashboard'}
              </h2>
              
              <div className="lg:hidden">
                <div className="text-gray-300 text-sm">studio32</div>
              </div>
            </div>
          </header>
          
          <div className="fixed top-16 right-0 bottom-0 left-0 lg:left-64 bg-gray-900 z-0"></div>
          
          <div className="pt-16 relative z-10 overflow-y-auto h-screen">
            {activeTab === 'overview' && (
              <StatsSection projectStats={projectStats} />
            )}
            
            {activeTab === 'projects' && (
              <div className="p-4 sm:p-6">
                <div className="mx-auto max-w-6xl">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg sm:text-xl font-semibold text-blue-300">Project Management</h3>
                    {/* Removed the "Add New Project" button from here */}
                  </div>
                  
                  
                  <div className="bg-gray-800 p-4 sm:p-6 rounded-lg border border-gray-700 shadow-lg">
                    <p className="text-gray-300 mb-4">Projects list will appear here.</p>
                    
                    {projects.length === 0 ? (
                      <div className="bg-gray-700 bg-opacity-50 border border-dashed border-gray-600 rounded-lg p-8 flex items-center justify-center min-h-64">
                        <div className="text-center text-gray-400">
                          <p>No projects added yet.</p>
                        </div>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <div className="inline-block min-w-full">
                          <div className="shadow overflow-hidden border-b border-gray-700 rounded-lg">
                            <table className="min-w-full divide-y divide-gray-700 transform bg-gray-800">
                              <thead className="bg-gray-700">
                                <tr>
                                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Title</th>
                                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Client</th>
                                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Due Date</th>
                                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Priority</th>
                                </tr>
                              </thead>
                              <tbody className="bg-gray-800 divide-y divide-gray-700">
                                {projects.map((project) => (
                                  <tr key={project.id} className="hover:bg-gray-700 transition-colors duration-200">
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">{project.title || 'N/A'}</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">{project.client === 'All' ? 'N/A' : project.client}</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                                      <span className={`px-2 py-1 rounded-full text-xs ${
                                        project.status === 'Completed' ? 'bg-green-900 text-green-300' :
                                        project.status === 'In Progress' ? 'bg-blue-900 text-blue-300' :
                                        project.status === 'On Hold' ? 'bg-yellow-900 text-yellow-300' :
                                        'bg-gray-600 text-gray-300'
                                      }`}>
                                        {project.status === 'All' ? 'N/A' : project.status}
                                      </span>
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">{project.dueDate || 'N/A'}</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                                      <span className={`px-2 py-1 rounded-full text-xs ${
                                        project.priority === 'High' ? 'bg-red-900 text-red-300' :
                                        project.priority === 'Medium' ? 'bg-yellow-900 text-yellow-300' :
                                        project.priority === 'Low' ? 'bg-green-900 text-green-300' :
                                        'bg-gray-600 text-gray-300'
                                      }`}>
                                        {project.priority === 'All' ? 'N/A' : project.priority}
                                      </span>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'clients' && (
              <div className="p-4 sm:p-6">
                <div className="max-w-7xl mx-auto">
                  {/* Render FormDash component directly */}
                  <DashForm/>
                </div>
              </div>
            )}
            
            {activeTab === 'settings' && (
              // Render Admin component instead of settings content
              <Admin onLogout={handleAdminLogout} token={adminToken} />
            )}
            
            {activeTab === 'correction' && (
              // Render ImageCorr component
              <ImageCorr />
            )}
            
            <div className="pb-16"></div>
          </div>
        </div>
        
        {mobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
            onClick={toggleMobileMenu}
          ></div>
        )}
      </div>
      
      {showProjectForm && (
        <Form 
          onClose={handleFormClose}
          projectData={editingProject}
        />
      )}
    </div>
  );
}

export default DashboardDesign;