// firebase-init.js
import { initializeApp, getApps, getApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyB_jkCjYBpGzkwxtLmC6DKF7g0xxAAUPck",
  authDomain: "neuro-grade-aefa0.firebaseapp.com",
  projectId: "neuro-grade-aefa0",
  storageBucket: "neuro-grade-aefa0.firebasestorage.app",
  messagingSenderId: "301322876081",
  appId: "1:301322876081:web:c3fd4b8302da63462e5e90"
};

// ✅ Initialize Firebase only once
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Export shared instances
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
