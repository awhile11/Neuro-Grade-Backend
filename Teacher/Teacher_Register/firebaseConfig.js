// firebaseConfig.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";

const firebaseConfig = {
  apiKey: "AIzaSyB_jkCjYBpGzkwxtLmC6DKF7g0xxAAUPck",
  authDomain: "neuro-grade-aefa0.firebaseapp.com",
  projectId: "neuro-grade-aefa0",
  storageBucket: "neuro-grade-aefa0.appspot.com", // ✅ corrected storage bucket
  messagingSenderId: "301322876081",
  appId: "1:301322876081:web:c3fd4b8302da63462e5e90"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
console.log("✅ Firebase initialized:", app.name);

export { app };
