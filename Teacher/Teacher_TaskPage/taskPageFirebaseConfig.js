// firebaseConfig.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB_jkCjYBpGzkwxtLmC6DKF7g0xxAAUPck",
  authDomain: "neuro-grade-aefa0.firebaseapp.com",
  projectId: "neuro-grade-aefa0",
  storageBucket: "neuro-grade-aefa0.firebasestorage.app",
  messagingSenderId: "301322876081",
  appId: "1:301322876081:web:c3fd4b8302da63462e5e90"
};

// Initialize Firebase App
export const app = initializeApp(firebaseConfig);
console.log("🔥 Firebase initialized:", app.name);
