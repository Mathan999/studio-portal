// firebaseService.jsx
import { initializeApp } from 'firebase/app';
import { 
  getDatabase, 
  ref, 
  push, 
  onValue, 
  set,
  remove} from 'firebase/database';

// Your Firebase configuration object
const firebaseConfig = {
  apiKey: "AIzaSyDv1KtqWziOhZD4m0ws5qY_92epUR4sYDM",
  authDomain: "studio32-7dd52.firebaseapp.com",
  databaseURL: "https://studio32-7dd52-default-rtdb.firebaseio.com",
  projectId: "studio32-7dd52",
  storageBucket: "studio32-7dd52.firebasestorage.app",
  messagingSenderId: "240031872694",
  appId: "1:240031872694:web:2045add4ccfe6e87a05817",
  measurementId: "G-FR84PQ7JYW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Create default form options if they don't exist
const initializeDefaultOptions = async () => {
  const defaultOptions = {
    jobType: [],
    status: [],
    hold: [],
    complexities: [],
    assignedUser: [],
    clients: [],
    artistCo: [],
    workflowType: [],
    qaErrors: [],
    category: [],
    tag: [],
    priority: []
  };
  
  const optionsRef = ref(database, 'formOptions');
  onValue(optionsRef, (snapshot) => {
    if (!snapshot.exists()) {
      // If formOptions doesn't exist, create it with default values
      set(optionsRef, defaultOptions);
    }
  }, { onlyOnce: true });
};

// Initialize default options
initializeDefaultOptions();

// Function to save project data
export const saveProject = async (projectData) => {
  try {
    const projectsRef = ref(database, 'projects');
    const newProjectRef = push(projectsRef);
    await set(newProjectRef, projectData);
    return newProjectRef.key;
  } catch (error) {
    console.error('Error saving project:', error);
    throw error;
  }
};

// Function to update project data
export const updateProject = async (projectId, projectData) => {
  try {
    const projectRef = ref(database, `projects/${projectId}`);
    await set(projectRef, projectData);
    return true;
  } catch (error) {
    console.error('Error updating project:', error);
    throw error;
  }
};

// Function to delete project
export const deleteProject = async (projectId) => {
  try {
    const projectRef = ref(database, `projects/${projectId}`);
    await remove(projectRef);
    return true;
  } catch (error) {
    console.error('Error deleting project:', error);
    throw error;
  }
};

// Function to fetch all projects
export const fetchProjects = (callback) => {
  const projectsRef = ref(database, 'projects');
  onValue(projectsRef, (snapshot) => {
    const data = snapshot.val();
    const projectsArray = data
      ? Object.keys(data).map((key) => ({ id: key, ...data[key] }))
      : [];
    callback(projectsArray);
  }, (error) => {
    console.error('Error fetching projects:', error);
  });
};

// Function to get form options
export const getFormOptions = (callback) => {
  const optionsRef = ref(database, 'formOptions');
  onValue(optionsRef, (snapshot) => {
    const data = snapshot.val() || {
      jobType: [],
      status: [],
      hold: [],
      complexities: [],
      assignedUser: [],
      clients: [],
      artistCo: [],
      workflowType: [],
      qaErrors: [],
      category: [],
      tag: [],
      priority: []
    };
    console.log("Firebase data fetched:", data);
    callback(data);
  }, (error) => {
    console.error('Error fetching form options:', error);
  });
};

// Function to add option to a specific category
export const addFormOption = async (category, value) => {
  try {
    if (!category || !value || value.trim() === '') {
      throw new Error('Category and value are required');
    }

    const optionsRef = ref(database, `formOptions/${category}`);
    
    // Get current values
    return new Promise((resolve, reject) => {
      onValue(optionsRef, async (snapshot) => {
        try {
          const currentValues = snapshot.val() || [];
          
          // Don't add duplicates
          if (!currentValues.includes(value)) {
            const updatedValues = [...currentValues, value];
            await set(optionsRef, updatedValues);
            console.log(`Successfully added ${value} to ${category}`);
          } else {
            console.log(`${value} already exists in ${category}`);
          }
          resolve();
        } catch (error) {
          console.error(`Error processing ${category} update:`, error);
          reject(error);
        }
      }, { onlyOnce: true });
    });
  } catch (error) {
    console.error(`Error adding ${value} to ${category}:`, error);
    throw error;
  }
};