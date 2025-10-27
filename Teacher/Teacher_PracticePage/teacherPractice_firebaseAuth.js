import { auth } from "./firebaseConfig.js";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

// Example: Sign Up
async function signUp(email, password) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    alert(`Signed up as ${userCredential.user.email}`);
  } catch (error) {
    alert(error.message);
  }
}

// Example: Sign In
async function signIn(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    alert(`Logged in as ${userCredential.user.email}`);
  } catch (error) {
    alert(error.message);
  }
}

// Example: Sign Out
async function logout() {
  await signOut(auth);
  alert('Logged out successfully');
}

// Monitor auth state
onAuthStateChanged(auth, user => {
  if (user) {
    console.log('User logged in:', user.email);
  } else {
    console.log('No user logged in');
  }
});
