// firebaseService.js
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, push, onValue, set } from 'firebase/database';

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