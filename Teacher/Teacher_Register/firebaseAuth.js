// firebaseAuth.js
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } 
  from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";
import { app } from "./firebaseConfig.js";

const auth = getAuth(app);

/**
 * Register new user with email & password
 */
async function registerUser(email, password) {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  return userCredential.user;
}

/**
 * Login existing user
 */
async function loginUser(email, password) {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
}

/**
 * Logout user
 */
async function logoutUser() {
  await signOut(auth);
}

export { auth, registerUser, loginUser, logoutUser };
