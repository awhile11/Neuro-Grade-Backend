import { initializeApp, getApps, getApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";
import { getFirestore, connectFirestoreEmulator } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";
import { getFunctions, connectFunctionsEmulator } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-functions.js";  // Correct import for Functions

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
const functions = getFunctions(app);

// Use emulators if on localhost
if (window.location.hostname === "localhost") {
  connectFirestoreEmulator(db, "localhost", 8080);    // Firestore
  connectFunctionsEmulator(functions, "localhost", 5001); // Cloud Functions
}

// Export shared instances
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db, functions };
