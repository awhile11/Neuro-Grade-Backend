import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";
import { getFunctions } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-functions.js";

// Your web app's Firebase configuration
 const firebaseConfig = {
    apiKey: "AIzaSyB_jkCjYBpGzkwxtLmC6DKF7g0xxAAUPck",
    authDomain: "neuro-grade-aefa0.firebaseapp.com",
    projectId: "neuro-grade-aefa0",
    storageBucket: "neuro-grade-aefa0.firebasestorage.app",
    messagingSenderId: "301322876081",
    appId: "1:301322876081:web:c3fd4b8302da63462e5e90"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const functions = getFunctions(app);