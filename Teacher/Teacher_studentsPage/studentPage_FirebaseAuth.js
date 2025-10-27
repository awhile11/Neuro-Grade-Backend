// firebaseAuth.js
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";
import { app } from "./firebaseConfig.js";

const auth = getAuth(app);

// Monitor login state
function monitorAuth(callback) {
  onAuthStateChanged(auth, user => {
    callback(user); // returns null if logged out
  });
}

// Login function
async function login(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
}

// Logout function
async function logout() {
  await signOut(auth);
}

export { auth, monitorAuth, login, logout };
