// firebaseAuth.js
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";
import { app } from "./firebaseConfig.js";

const auth = getAuth(app);

// 🔹 Monitor auth state
function monitorAuthState(callback = () => {}) {
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      console.log("⚠️ Not logged in, redirecting to login...");
      window.location.replace("./LogIn.html");
      return;
    }
    console.log("✅ Logged in:", user.email);
    callback(user);
  });
}

// 🔹 Logout function
async function logoutUser() {
  try {
    await signOut(auth);
    console.log("👋 User signed out");
    window.location.replace("./LogIn.html");
  } catch (err) {
    console.error("❌ Logout error:", err.message);
  }
}

// 🔹 Get current user
function getCurrentUser() {
  return auth.currentUser;
}

export { auth, monitorAuthState, logoutUser, getCurrentUser };
