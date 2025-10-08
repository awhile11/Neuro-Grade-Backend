 //Import the Firebase SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { auth, db } from "../services/firebase-init.js";

  // Your Firebase project config (from Firebase Console → Project Settings)
  const firebaseConfig = {
    apiKey: "AIzaSyDZ5cw7ZtR2R8dxeGJTlf8A4fxRBKdSGvk",
    authDomain: "neuro-grade.firebaseapp.com",
    databaseURL: "https://neuro-grade-default-rtdb.firebaseio.com/", 
    projectId: "neuro-grade",
    storageBucket: "neuro-grade.appspot.com",
    messagingSenderId: "1079661391912",
    appId: "1:1079661391912:web:15e0cefff0d8362030451d",
    measurementId: "G-92LDP7B16L"
  };

  //Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);

  // Login with Email/Password
  document.getElementById("studentForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      // 🔹 Show success modal
    showSuccessModal(studentNumber);
      // Redirect to dashboard page
      window.location.href = "dashboard.html";
    } catch (error) {
      alert("Error: " + error.message);
    }
  });
  
