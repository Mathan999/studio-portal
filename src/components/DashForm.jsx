import React, { useState, useEffect } from 'react';
import { fetchProjects, deleteProject } from '../services/firebaseService';
import Form from './Form';

function DashForm() {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const projectsData = await fetchProjects();
      
      // Check if projectsData is valid before setting it
      if (Array.isArray(projectsData)) {
        setProjects(projectsData);
      } else {
        console.error('Invalid projects data:', projectsData);
        setProjects([]);
        setError('Failed to load projects. Received invalid data.');
      }
    } catch (error) {
      console.error('Error loading projects:', error);
      setProjects([]);
      setError('Failed to load projects. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddProject = () => {
    setSelectedProject(null);
    setShowForm(true);
  };

  const handleEditProject = (project) => {
    setSelectedProject(project);
    setShowForm(true);
  };

  const handleDeleteProject = async (projectId) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await deleteProject(projectId);
        loadProjects();
      } catch (error) {
        console.error('Error deleting project:', error);
        setError('Failed to delete project. Please try again later.');
      }
    }
  };

  const handleFormClose = (formData) => {
    setShowForm(false);
    if (formData) {
      loadProjects();
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Add safety check with || [] to prevent "undefined" errors
  const filteredProjects = (projects || []).filter(project => {
    if (!project) return false;
    
    const searchTermLower = searchTerm.toLowerCase();
    return (
      (project.sku && project.sku.toLowerCase().includes(searchTermLower)) ||
      (project.title && project.title.toLowerCase().includes(searchTermLower)) ||
      (project.client && project.client.toLowerCase().includes(searchTermLower)) ||
      (project.status && project.status.toLowerCase().includes(searchTermLower)) ||
      (project.jobType && project.jobType.toLowerCase().includes(searchTermLower)) ||
      (project.assignedUser && project.assignedUser.toLowerCase().includes(searchTermLower)) ||
      (project.complexity && project.complexity.toLowerCase().includes(searchTermLower)) ||
      (project.hold && project.hold.toLowerCase().includes(searchTermLower)) ||
      (project.artistCo && project.artistCo.toLowerCase().includes(searchTermLower)) ||
      (project.workflowType && project.workflowType.toLowerCase().includes(searchTermLower)) ||
      (project.qaErrors && project.qaErrors.toLowerCase().includes(searchTermLower)) ||
      (project.optionId && project.optionId.toLowerCase().includes(searchTermLower)) ||
      (project.tag && project.tag.toLowerCase().includes(searchTermLower)) ||
      (project.priority && project.priority.toLowerCase().includes(searchTermLower)) ||
      (project.imageUrl && project.imageUrl.toLowerCase().includes(searchTermLower))
    );
  });

  return (
    <div className="p-6 min-h-screen bg-gray-900 text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-blue-400">Client Dashboard</h1>
        <button
          onClick={handleAddProject}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-7 rounded transition duration-300"
        >
          Add New Project
        </button>
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search projects..."
          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:border-blue-500"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      {error && (
        <div className="bg-red-900 text-white p-4 mb-6 rounded">
          <p>{error}</p>
          <button 
            onClick={loadProjects}
            className="mt-2 bg-red-700 hover:bg-red-600 text-white px-4 py-2 rounded"
          >
            Try Again
          </button>
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading projects...</p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-gray-800 rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-800">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">SKU</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Title</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Client</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Job Type</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Assigned</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Complexity</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Hold</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Details</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Clients</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Artist Co</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Workflow</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Self Serve</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">QA Errors</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Option ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Category</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Tag</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Due Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Priority</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Image</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredProjects.length > 0 ? (
                filteredProjects.map((project) => (
                  <tr key={project.id} className="hover:bg-gray-750">
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">{project.sku || '-'}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">{project.title || '-'}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">{project.client || '-'}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        project.status === 'completed' ? 'bg-green-800 text-green-100' :
                        project.status === 'in progress' ? 'bg-blue-800 text-blue-100' :
                        project.status === 'pending' ? 'bg-yellow-800 text-yellow-100' :
                        project.status === 'Active' ? 'bg-blue-800 text-blue-100' :
                        'bg-gray-800 text-gray-100'
                      }`}>
                        {project.status || 'All'}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">{project.jobType || '-'}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">{project.assignedUser || '-'}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">{project.complexity || '-'}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">{project.hold || '-'}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">{project.title || '-'}</td> {/* Assuming Project Details maps to Title */}
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">{project.client || '-'}</td> {/* Assuming Clients maps to Client */}
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">{project.artistCo || '-'}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">{project.workflowType || '-'}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">{project.selfserveJobs ? 'Yes' : 'No'}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">{project.qaErrors || '-'}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">{project.optionId || '-'}</td> {/* Assuming Additional Options maps to Option ID */}
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">
                      {project.category && project.category.length > 0 ? project.category.join(', ') : '-'}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">{project.tag || '-'}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">{project.dueDate || '-'}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        project.priority === 'high' ? 'bg-red-800 text-red-100' :
                        project.priority === 'medium' ? 'bg-orange-800 text-orange-100' :
                        project.priority === 'low' ? 'bg-green-800 text-green-100' :
                        project.priority === 'dfg' ? 'bg-purple-800 text-purple-100' :
                        'bg-gray-600 text-gray-100'
                      }`}>
                        {project.priority || 'All'}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">
                      {project.imageUrl ? (
                        <img 
                          src={project.imageUrl} 
                          alt={`Image for ${project.title}`} 
                          className="w-12 h-12 object-cover rounded"
                        />
                      ) : '-'}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditProject(project)}
                          className="text-blue-500 hover:text-blue-400"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeleteProject(project.id)}
                          className="text-red-500 hover:text-red-400"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="22" className="px-6 py-10 text-center text-gray-400 text-sm">
                    No projects found. Add a new project to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <Form
          onClose={handleFormClose}
          projectData={selectedProject}
        />
      )}
    </div>
  );
}

export default DashForm;