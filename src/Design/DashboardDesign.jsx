import React, { useState, useEffect } from 'react';
import Form from '../components/Form'; // Ensure path is correct
import { fetchProjects, deleteProject } from '../services/firebaseService'; // Import Firebase service

function DashboardDesign({
  projectStats,
  activeTab,
  setActiveTab,
  handleLogout,
  toggleMobileMenu,
  mobileMenuOpen
}) {
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [projects, setProjects] = useState([]); // State for projects

  // Fetch projects from Firebase
  useEffect(() => {
    fetchProjects((projectsData) => {
      setProjects(projectsData);
    });
  }, []);

  const handleOpenForm = () => {
    setEditingProject(null);
    setShowProjectForm(true);
  };

  const handleEditProject = (project) => {
    setEditingProject(project);
    setShowProjectForm(true);
  };

  const handleDeleteProject = async (projectId) => {
    try {
      await deleteProject(projectId);
      // Update local state after successful deletion
      setProjects(projects.filter(project => project.id !== projectId));
    } catch (error) {
      console.error('Failed to delete project:', error);
    }
  };

  const handleFormClose = (formData) => {
    setShowProjectForm(false);
    if (formData) {
      console.log('Form submitted with data:', formData);
      // Refresh projects after form submission
      fetchProjects((projectsData) => {
        setProjects(projectsData);
      });
    }
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
              <button 
                className={`w-full text-left px-6 py-3 font-medium ${activeTab === 'overview' ? 'bg-gray-700 text-blue-400 border-l-4 border-blue-400' : 'text-gray-300 hover:bg-gray-700 hover:text-gray-100'}`}
                onClick={() => setActiveTab('overview')}
              >
                Overview
              </button>
              <button 
                className={`w-full text-left px-6 py-3 font-medium ${activeTab === 'projects' ? 'bg-gray-700 text-blue-400 border-l-4 border-blue-400' : 'text-gray-300 hover:bg-gray-700 hover:text-gray-100'}`}
                onClick={() => setActiveTab('projects')}
              >
                Projects
              </button>
              <button 
                className={`w-full text-left px-6 py-3 font-medium ${activeTab === 'clients' ? 'bg-gray-700 text-blue-400 border-l-4 border-blue-400' : 'text-gray-300 hover:bg-gray-700 hover:text-gray-100'}`}
                onClick={() => setActiveTab('clients')}
              >
                Clients
              </button>
              <button 
                className={`w-full text-left px-6 py-3 font-medium ${activeTab === 'settings' ? 'bg-gray-700 text-blue-400 border-l-4 border-blue-400' : 'text-gray-300 hover:bg-gray-700 hover:text-gray-100'}`}
                onClick={() => setActiveTab('settings')}
              >
                Settings
              </button>
              <button 
                className={`w-full text-left px-6 py-3 font-medium text-gray-300 hover:bg-gray-700 hover:text-gray-100`}
              >
                Reports
              </button>
              <button 
                className={`w-full text-left px-6 py-3 font-medium text-gray-300 hover:bg-gray-700 hover:text-gray-100`}
              >
                Analytics
              </button>
              <button 
                className={`w-full text-left px-6 py-3 font-medium text-gray-300 hover:bg-gray-700 hover:text-gray-100`}
              >
                Documents
              </button>
              <button 
                className={`w-full text-left px-6 py-3 font-medium text-gray-300 hover:bg-gray-700 hover:text-gray-100`}
              >
                Messages
              </button>
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
                 activeTab === 'clients' ? 'Clients' : 
                 activeTab === 'settings' ? 'Settings' : 'Dashboard'}
              </h2>
              
              <div className="lg:hidden">
                <div className="text-gray-300 text-sm">studio32</div>
              </div>
            </div>
          </header>
          
          <div className="fixed top-16 right-0 bottom-0 left-0 lg:left-64 bg-gray-900 z-0"></div>
          
          <div className="pt-16 relative z-10 overflow-y-auto h-screen">
            {activeTab === 'overview' && (
              <div className="p-4 sm:p-6">
                <div className="mx-auto max-w-6xl">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 mb-6">
                    <div className="bg-gray-800 p-4 sm:p-6 rounded-lg border border-gray-700 shadow-lg">
                      <h3 className="text-lg sm:text-xl font-semibold mb-2 text-blue-300">Active Projects</h3>
                      <p className="text-2xl sm:text-3xl font-bold text-white">{projectStats.activeProjects}</p>
                    </div>
                    <div className="bg-gray-800 p-4 sm:p-6 rounded-lg border border-gray-700 shadow-lg">
                      <h3 className="text-lg sm:text-xl font-semibold mb-2 text-green-300">Completed Projects</h3>
                      <p className="text-2xl sm:text-3xl font-bold text-white">{projectStats.completedProjects}</p>
                    </div>
                    <div className="bg-gray-800 p-4 sm:p-6 rounded-lg border border-gray-700 shadow-lg sm:col-span-2 lg:col-span-1">
                      <h3 className="text-lg sm:text-xl font-semibold mb-2 text-yellow-300">Pending Review</h3>
                      <p className="text-2xl sm:text-3xl font-bold text-white">{projectStats.pendingReview}</p>
                    </div>
                  </div>
                  
                  <div className="bg-gray-800 p-4 sm:p-6 rounded-lg border border-gray-700 shadow-lg">
                    <h3 className="text-lg sm:text-xl font-semibold mb-3 text-blue-300">Overview Dashboard</h3>
                    <div className="text-gray-300">
                      <p className="mb-2">Welcome to your project overview dashboard.</p>
                      <p>Here you can see your project statistics and manage your workflow.</p>
                    </div>
                  </div>
                  
                  <div className="mt-6 bg-gray-800 p-4 sm:p-6 rounded-lg border border-gray-700 shadow-lg">
                    <h3 className="text-lg sm:text-xl font-semibold mb-3 text-blue-300">Recent Activity</h3>
                    <div className="text-gray-300">
                      <p className="mb-2">Your recent activity will appear here.</p>
                      <div className="space-y-4">
                        {[1, 2, 3, 4, 5].map((item) => (
                          <div key={item} className="p-3 bg-gray-700 rounded-lg">
                            <p className="text-gray-200">Activity item {item}</p>
                            <p className="text-sm text-gray-400 mt-1">April {item + 5}, 2025</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'projects' && (
              <div className="p-4 sm:p-6">
                <div className="mx-auto max-w-6xl">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg sm:text-xl font-semibold text-blue-300">Project Management</h3>
                    <button 
                      onClick={handleOpenForm}
                      className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                    >
                      Add New Project
                    </button>
                  </div>
                  
                  <div className="bg-gray-800 p-4 sm:p-6 rounded-lg border border-gray-700 shadow-lg">
                    <p className="text-gray-300 mb-4">Projects list will appear here.</p>
                    
                    {projects.length === 0 ? (
                      <div className="bg-gray-700 bg-opacity-50 border border-dashed border-gray-600 rounded-lg p-8 flex items-center justify-center min-h-64">
                        <div className="text-center text-gray-400">
                          <p>No projects added yet. Click "Add New Project" to get started.</p>
                        </div>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <div className="inline-block min-w-full">
                          <div className="shadow overflow-hidden border-b border-gray-700 rounded-lg">
                            <table className="min-w-full divide-y divide-gray-700 transform bg-gray-800">
                              <thead className="bg-gray-700">
                                <tr>
                                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">SKU</th>
                                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Title</th>
                                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Client</th>
                                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Job Type</th>
                                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Due Date</th>
                                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Assigned To</th>
                                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Complexity</th>
                                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Hold</th>
                                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Artist</th>
                                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Workflow</th>
                                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Priority</th>
                                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Categories</th>
                                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Tags</th>
                                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">QA Errors</th>
                                  <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider">Self-Serve</th>
                                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Option ID</th>
                                  <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                                </tr>
                              </thead>
                              <tbody className="bg-gray-800 divide-y divide-gray-700">
                                {projects.map((project) => (
                                  <tr key={project.id} className="hover:bg-gray-700 transition-colors duration-200">
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">{project.sku || 'N/A'}</td>
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
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">{project.jobType === 'All' ? 'N/A' : project.jobType}</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">{project.dueDate || 'N/A'}</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">{project.assignedUser === 'All' ? 'N/A' : project.assignedUser}</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">{project.complexity === 'All' ? 'N/A' : project.complexity}</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">{project.hold === 'All' ? 'N/A' : project.hold}</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">{project.artistCo === 'All' ? 'N/A' : project.artistCo}</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">{project.workflowType === 'All' ? 'N/A' : project.workflowType}</td>
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
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                                      {project.category && project.category.length > 0 
                                        ? project.category.slice(0, 2).join(', ') + (project.category.length > 2 ? '...' : '') 
                                        : 'N/A'}
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">{project.tag === 'All' ? 'N/A' : project.tag}</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">{project.qaErrors === 'All' ? 'N/A' : project.qaErrors}</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-center text-sm text-gray-300">
                                      {project.selfserveJobs 
                                        ? <span className="bg-blue-900 text-blue-300 px-2 py-1 rounded-full text-xs">Yes</span> 
                                        : <span className="bg-gray-600 text-gray-300 px-2 py-1 rounded-full text-xs">No</span>}
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">{project.optionId || 'N/A'}</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                                      <div className="flex justify-center space-x-2">
                                        <button 
                                          onClick={() => handleEditProject(project)}
                                          className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded transition-colors"
                                        >
                                          Edit
                                        </button>
                                        <button 
                                          onClick={() => handleDeleteProject(project.id)}
                                          className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded transition-colors"
                                        >
                                          Delete
                                        </button>
                                      </div>
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
                <div className="mx-auto max-w-6xl">
                  <div className="bg-gray-800 p-4 sm:p-6 rounded-lg border border-gray-700 shadow-lg">
                    <h3 className="text-lg sm:text-xl font-semibold text-blue-300 mb-4">Client Management</h3>
                    
                    <div className="bg-gray-700 bg-opacity-50 border border-dashed border-gray-600 rounded-lg p-8 flex items-center justify-center min-h-64">
                      <div className="text-center text-gray-400">
                        <p>Client information will be displayed here.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 bg-gray-800 p-4 sm:p-6 rounded-lg border border-gray-700 shadow-lg">
                    <h3 className="text-lg sm:text-xl font-semibold mb-3 text-blue-300">Recent Clients</h3>
                    <div className="space-y-4">
                      {[1, 2, 3, 4, 5].map((item) => (
                        <div key={item} className="p-3 bg-gray-700 rounded-lg flex justify-between items-center">
                          <div>
                            <h4 className="text-gray-200 font-medium">Client {item}</h4>
                            <p className="text-sm text-gray-400">Last contacted: April {item + 1}, 2025</p>
                          </div>
                          <div className="text-gray-400 text-sm">
                            {item} active projects
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'settings' && (
              <div className="p-4 sm:p-6">
                <div className="mx-auto max-w-6xl">
                  <div className="bg-gray-800 p-4 sm:p-6 rounded-lg border border-gray-700 shadow-lg">
                    <h3 className="text-lg sm:text-xl font-semibold text-blue-300 mb-4">Settings</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="p-4 border border-gray-700 rounded-lg bg-gray-700 bg-opacity-50">
                        <h4 className="text-base font-medium text-blue-200 mb-2">Account Settings</h4>
                        <p className="text-gray-300">Manage your account preferences.</p>
                      </div>
                      <div className="p-4 border border-gray-700 rounded-lg bg-gray-700 bg-opacity-50">
                        <h4 className="text-base font-medium text-blue-200 mb-2">Notification Settings</h4>
                        <p className="text-gray-300">Configure your notification preferences.</p>
                      </div>
                      <div className="p-4 border border-gray-700 rounded-lg bg-gray-700 bg-opacity-50 md:col-span-2">
                        <h4 className="text-base font-medium text-blue-200 mb2">Display Settings</h4>
                        <p className="text-gray-300">Customize the appearance of your dashboard.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 bg-gray-800 p-4 sm:p-6 rounded-lg border border-gray-700 shadow-lg">
                    <h3 className="text-lg sm:text-xl font-semibold mb-3 text-blue-300">Additional Settings</h3>
                    <div className="space-y-4">
                      {[1, 2, 3, 4].map((item) => (
                        <div key={item} className="p-3 bg-gray-700 rounded-lg">
                          <h4 className="text-gray-200 font-medium">Setting Group {item}</h4>
                          <p className="text-sm text-gray-400 mt-1">Configure additional settings for your dashboard.</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
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