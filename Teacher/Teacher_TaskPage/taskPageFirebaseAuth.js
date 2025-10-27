// firebaseAuth.js
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";
import { app } from "./firebaseConfig.js";

// Initialize Auth
export const auth = getAuth(app);

/**
 * Monitor login state and redirect if not logged in
 */
export function monitorAuthState(callback = () => {}) {
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      console.warn("⚠️ Not logged in, redirecting...");
      window.location.replace("./LogIn.html");
    } else {
      console.log("✅ Logged in as:", user.email);
      callback(user);
    }
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
