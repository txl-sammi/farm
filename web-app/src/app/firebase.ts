// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA3VM8V7iSxzh4xH98eEAHQb8ppNI5aIjI",
  authDomain: "codebrew2025-451bf.firebaseapp.com",
  projectId: "codebrew2025-451bf",
  storageBucket: "codebrew2025-451bf.firebasestorage.app",
  messagingSenderId: "447872057856",
  appId: "1:447872057856:web:7189eb7fb0e544d1934ee5",
  measurementId: "G-2VMCL2GW7G"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);