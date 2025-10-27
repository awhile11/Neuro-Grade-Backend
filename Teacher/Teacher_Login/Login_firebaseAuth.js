// firebaseAuth.js
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";
import { app } from "./firebaseConfig.js";

const auth = getAuth(app);

/**
 * Log in user with email and password
 */
async function loginUser(email, password) {
  return await signInWithEmailAndPassword(auth, email, password);
}

/**
 * Send password reset email
 */
async function resetPassword(email) {
  return await sendPasswordResetEmail(auth, email);
}

export { auth, loginUser, resetPassword };
