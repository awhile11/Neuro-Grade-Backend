// Import Firebase core + auth
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB_jkCjYBpGzkwxtLmC6DKF7g0xxAAUPck",
  authDomain: "neuro-grade-aefa0.firebaseapp.com",
  projectId: "neuro-grade-aefa0",
  storageBucket: "neuro-grade-aefa0.firebasestorage.app",
  messagingSenderId: "301322876081",
  appId: "1:301322876081:web:c3fd4b8302da63462e5e90"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
console.log("🔥 Firebase initialized:", app.name);

export const auth = getAuth(app);

/**
 * Monitor login state and call callback if user is logged in
 * @param {function} callback - Function(user) called when user is logged in
 */
export function monitorAuthState(callback = () => {}) {
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      console.log("⚠️ Not logged in, redirecting...");
      window.location.replace("./LogIn.html");
      return;
    }
    console.log("✅ Logged in:", user.email);
    callback(user);
  });
}

/**
 * Logout the current user
 */
export async function logoutUser() {
  try {
    await signOut(auth);
    console.log("👋 User signed out");
    window.location.replace("./LogIn.html");
  } catch (err) {
    console.error("❌ Logout error:", err.message);
  }
}

/**
 * Get currently logged-in user
 */
export function getCurrentUser() {
  return auth.currentUser;
}
