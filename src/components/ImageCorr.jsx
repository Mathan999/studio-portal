import React, { useState, useEffect } from 'react';
import { database } from '../services/firebaseService';
import { ref, onValue, remove, update } from 'firebase/database';
import Correction from './Correction'; // Import the Correction component

function ImageCorr() {
  const [imageData, setImageData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  // New state to control whether to show the Correction component
  const [showCorrection, setShowCorrection] = useState(false);
  // New state to store the selected image for correction
  const [correctionImage, setCorrectionImage] = useState(null);
  
  // New states for edit functionality
  const [showEditModal, setShowEditModal] = useState(false);
  const [editImageData, setEditImageData] = useState(null);
  // New state for delete confirmation
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [imageToDelete, setImageToDelete] = useState(null);

  useEffect(() => {
    // Reference to the EditImageCorrection database
    const imageDbRef = ref(database, 'EditImageCorrection');
    
    // Set up listener for data changes
    const unsubscribe = onValue(imageDbRef, (snapshot) => {
      try {
        setLoading(true);
        const data = snapshot.val();
        
        if (data) {
          // Convert object to array and add the key as id
          const imagesArray = Object.entries(data).map(([id, values]) => ({
            id,
            ...values
          }));
          
          // Sort by most recent first
          imagesArray.sort((a, b) => {
            return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
          });
          
          setImageData(imagesArray);
          setFilteredData(imagesArray);
        } else {
          setImageData([]);
          setFilteredData([]);
        }
      } catch (err) {
        console.error('Error fetching image data:', err);
        setError('Failed to load images. Please try again later.');
      } finally {
        setLoading(false);
      }
    }, (error) => {
      console.error('Database read failed:', error);
      setError('Failed to connect to the database. Please try again later.');
      setLoading(false);
    });
    
    // Clean up listener on component unmount
    return () => unsubscribe();
  }, []);

  // Handle search functionality
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredData(imageData);
    } else {
      const lowercasedSearch = searchTerm.toLowerCase();
      const filtered = imageData.filter(item => 
        (item.client && item.client.toLowerCase().includes(lowercasedSearch)) ||
        (item.title && item.title.toLowerCase().includes(lowercasedSearch)) ||
        (item.sku && item.sku.toLowerCase().includes(lowercasedSearch))
      );
      setFilteredData(filtered);
    }
  }, [searchTerm, imageData]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  const handleChangesClick = (imageId, e) => {
    // Prevent the click from bubbling up to the parent (which would open the modal)
    e.stopPropagation();
    
    // Find the selected image by ID
    const selectedImg = imageData.find(img => img.id === imageId);
    
    if (selectedImg) {
      // Set the image for correction
      setCorrectionImage(selectedImg);
      // Show the Correction component
      setShowCorrection(true);
      // Close the modal if it's open
      setSelectedImage(null);
    }
  };

  // Handler to exit correction mode and return to gallery
  const handleExitCorrection = () => {
    setShowCorrection(false);
    setCorrectionImage(null);
  };

  // New function for handling edit button click
  const handleEditClick = (imageId, e) => {
    // Prevent the click from bubbling up to the parent
    e.stopPropagation();
    
    // Find the selected image by ID
    const imageToEdit = imageData.find(img => img.id === imageId);
    
    if (imageToEdit) {
      // Set the image data for editing
      setEditImageData({...imageToEdit});
      // Show the edit modal
      setShowEditModal(true);
      // Close other modals if they're open
      setSelectedImage(null);
    }
  };

  // Handle form input changes for editing
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditImageData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Submit the edited data to Firebase
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Reference to the specific image in Firebase
      const imageRef = ref(database, `EditImageCorrection/${editImageData.id}`);
      
      // Update data in Firebase
      await update(imageRef, {
        client: editImageData.client || '',
        title: editImageData.title || '',
        sku: editImageData.sku || '',
        description: editImageData.description || '',
        // We keep the imageUrl and createdAt unchanged
      });
      
      // Close the edit modal
      setShowEditModal(false);
      setEditImageData(null);
    } catch (err) {
      console.error('Error updating image data:', err);
      alert('Failed to update image data. Please try again.');
    }
  };

  // New function for handling delete button click
  const handleDeleteClick = (imageId, e) => {
    // Prevent the click from bubbling up to the parent
    e.stopPropagation();
    
    // Set the image to delete
    setImageToDelete(imageId);
    // Show delete confirmation
    setShowDeleteConfirm(true);
    // Close other modals if they're open
    setSelectedImage(null);
  };

  // Handle confirm delete
  const handleConfirmDelete = async () => {
    if (!imageToDelete) return;
    
    try {
      // Reference to the specific image in Firebase
      const imageRef = ref(database, `EditImageCorrection/${imageToDelete}`);
      
      // Remove the image from Firebase
      await remove(imageRef);
      
      // Close the confirmation modal
      setShowDeleteConfirm(false);
      setImageToDelete(null);
    } catch (err) {
      console.error('Error deleting image:', err);
      alert('Failed to delete image. Please try again.');
    }
  };

  // If in correction mode, show the Correction component
  if (showCorrection && correctionImage) {
    return (
      <div className="bg-blue min-h-screen w-full">
        <div className="flex justify-between items-center bg-gray-900 px-4 py-2">
          <button 
            onClick={handleExitCorrection}
            className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-md flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
            </svg>
            Back to Gallery
          </button>
          <h2 className="text-blue-300 font-semibold">
            {correctionImage.client || 'Unknown'} - {correctionImage.title || 'Untitled'}
          </h2>
        </div>
        <Correction imageData={correctionImage} />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-black">
        <div className="text-blue-400">Loading image data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-black">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="bg-blue min-h-screen w-full">
      {/* Main content container - removed overflow-x-hidden since we'll control it better */}
      <div className="max-w-6xl mx-auto p-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <h1 className="text-2xl text-blue-400 font-bold mb-4 md:mb-0">Image Corrections</h1>
          
          <div className="w-full md:w-64">
            <input
              type="text"
              placeholder="Search by client, title, or SKU"
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full px-4 py-2 bg-gray-800 text-blue-200 rounded-lg border border-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        
        {filteredData.length === 0 ? (
          <div className="bg-gray-900 rounded-lg p-6 text-blue-300 text-center">
            {searchTerm ? 'No matching images found.' : 'No image data available.'}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredData.map((item) => (
              <div key={item.id} className="bg-gray-900 rounded-lg overflow-hidden border border-blue-900 shadow-lg flex flex-col">
                <div 
                  className="relative cursor-pointer flex-grow"
                  onClick={() => handleImageClick(item)}
                >
                  {item.imageUrl ? (
                    <div className="relative pt-[75%]"> {/* 4:3 Aspect ratio */}
                      <img 
                        src={item.imageUrl}
                        alt={`${item.client || 'Unknown'} - ${item.title || 'Untitled'}`}
                        className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/placeholder-image.png';
                        }}
                      />
                    </div>
                  ) : (
                    <div className="relative pt-[75%]"> {/* 4:3 Aspect ratio */}
                      <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 text-gray-500">
                        No Image Available
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-4 bg-gray-900">
                  <h3 className="text-lg font-semibold text-blue-300 truncate">{item.client || 'Unknown Client'}</h3>
                  {item.title && <p className="text-blue-100 mt-1 truncate">{item.title}</p>}
                  {item.sku && <p className="text-blue-100 text-sm mt-1 truncate">SKU: {item.sku}</p>}
                  <div className="flex justify-between items-center mt-3">
                    <p className="text-blue-200 text-xs">
                      {item.createdAt 
                        ? new Date(item.createdAt).toLocaleString()
                        : 'Date unavailable'}
                    </p>
                    <div className="flex space-x-2">
                      <button
                        onClick={(e) => handleChangesClick(item.id, e)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm transition-colors duration-200"
                      >
                        Changes
                      </button>
                      <button
                        onClick={(e) => handleEditClick(item.id, e)}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-sm transition-colors duration-200"
                      >
                        Edit
                      </button>
                      <button
                        onClick={(e) => handleDeleteClick(item.id, e)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm transition-colors duration-200"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal for displaying clicked image - improved for responsive behavior */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4 overflow-y-auto"
          onClick={closeModal}
        >
          <div 
            className="max-w-4xl w-full bg-gray-900 rounded-lg overflow-hidden relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              className="absolute top-4 right-4 bg-gray-800 text-white rounded-full p-2 hover:bg-gray-700 z-10"
              onClick={closeModal}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <div className="p-4 flex flex-col md:flex-row">
              <div className="md:w-2/3">
                {selectedImage.imageUrl ? (
                  <div className="relative pt-[75%] md:pt-[56.25%]"> {/* 4:3 on mobile, 16:9 on desktop */}
                    <img 
                      src={selectedImage.imageUrl}
                      alt={`${selectedImage.client || 'Unknown'} - ${selectedImage.title || 'Untitled'}`}
                      className="absolute top-0 left-0 w-full h-full object-contain"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/placeholder-image.png';
                      }}
                    />
                  </div>
                ) : (
                  <div className="relative pt-[75%] md:pt-[56.25%]">
                    <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 text-gray-500">
                      No Image Available
                    </div>
                  </div>
                )}
              </div>
              
              <div className="md:w-1/3 p-4">
                <h2 className="text-xl font-bold text-blue-300 mb-4">{selectedImage.client || 'Unknown Client'}</h2>
                {selectedImage.title && <p className="text-blue-100 mb-2"><span className="font-semibold">Title:</span> {selectedImage.title}</p>}
                {selectedImage.sku && <p className="text-blue-100 mb-2"><span className="font-semibold">SKU:</span> {selectedImage.sku}</p>}
                {selectedImage.createdAt && (
                  <p className="text-blue-200 text-sm mb-4">
                    <span className="font-semibold">Date:</span> {new Date(selectedImage.createdAt).toLocaleString()}
                  </p>
                )}
                
                {/* Additional details can be added here */}
                {selectedImage.description && (
                  <p className="text-blue-100 mb-2"><span className="font-semibold">Description:</span> {selectedImage.description}</p>
                )}
                
                {/* Action buttons in modal */}
                <div className="flex space-x-2 mt-4">
                  <button
                    onClick={(e) => handleChangesClick(selectedImage.id, e)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm transition-colors duration-200"
                  >
                    Changes
                  </button>
                  <button
                    onClick={(e) => handleEditClick(selectedImage.id, e)}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm transition-colors duration-200"
                  >
                    Edit
                  </button>
                  <button
                    onClick={(e) => handleDeleteClick(selectedImage.id, e)}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm transition-colors duration-200"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editImageData && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4 overflow-y-auto"
          onClick={() => setShowEditModal(false)}
        >
          <div 
            className="max-w-2xl w-full bg-gray-900 rounded-lg overflow-hidden relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gray-800 p-4 border-b border-gray-700">
              <h2 className="text-xl font-bold text-blue-300">Edit Image Details</h2>
            </div>
            
            <button 
              className="absolute top-4 right-4 bg-gray-700 text-white rounded-full p-2 hover:bg-gray-600 z-10"
              onClick={() => setShowEditModal(false)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <form onSubmit={handleEditSubmit} className="p-6">
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-blue-300 mb-2" htmlFor="client">Client Name</label>
                  <input
                    id="client"
                    name="client"
                    type="text"
                    value={editImageData.client || ''}
                    onChange={handleEditInputChange}
                    className="w-full px-4 py-2 bg-gray-800 text-blue-200 rounded-lg border border-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-blue-300 mb-2" htmlFor="title">Title</label>
                  <input
                    id="title"
                    name="title"
                    type="text"
                    value={editImageData.title || ''}
                    onChange={handleEditInputChange}
                    className="w-full px-4 py-2 bg-gray-800 text-blue-200 rounded-lg border border-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-blue-300 mb-2" htmlFor="sku">SKU</label>
                  <input
                    id="sku"
                    name="sku"
                    type="text"
                    value={editImageData.sku || ''}
                    onChange={handleEditInputChange}
                    className="w-full px-4 py-2 bg-gray-800 text-blue-200 rounded-lg border border-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-blue-300 mb-2" htmlFor="description">Description</label>
                  <textarea
                    id="description"
                    name="description"
                    value={editImageData.description || ''}
                    onChange={handleEditInputChange}
                    rows="4"
                    className="w-full px-4 py-2 bg-gray-800 text-blue-200 rounded-lg border border-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div className="flex justify-end space-x-4 mt-4">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-md transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md transition-colors duration-200"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
          onClick={() => setShowDeleteConfirm(false)}
        >
          <div 
            className="max-w-md w-full bg-gray-900 rounded-lg overflow-hidden shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-red-600 p-4">
              <h3 className="text-white text-lg font-bold">Confirm Deletion</h3>
            </div>
            
            <div className="p-6">
              <p className="text-blue-100 mb-6">Are you sure you want to delete this image? This action cannot be undone.</p>
              
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors duration-200"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ImageCorr;