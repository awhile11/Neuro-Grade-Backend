// Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
  import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";
  import {getFirestore, setDoc, doc} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js"; 

  
  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyB_jkCjYBpGzkwxtLmC6DKF7g0xxAAUPck",
    authDomain: "neuro-grade-aefa0.firebaseapp.com",
    projectId: "neuro-grade-aefa0",
    storageBucket: "neuro-grade-aefa0.firebasestorage.app",
    messagingSenderId: "301322876081",
    appId: "1:301322876081:web:c3fd4b8302da63462e5e90"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const signUp = document.getElementById("submitSignUp");
  signUp.addEventListener("click", (event)=>{
    event.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    const auth = getAuth();
    const db = getFirestore();

    createUserWithEmailAndPassword( auth, email, password) 
    .then((userCredential)=>{
        const user = userCredential.user;
        const userData = {
            email: email,
            firstName: firstName,
            lastName:lastName
        };
    })
  })
