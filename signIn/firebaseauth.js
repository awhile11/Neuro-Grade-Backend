  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-analytics.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyAt_S5Ba4_d40InN608zBfC_mcUerxMaN4",
    authDomain: "neuro-grade-9a10e.firebaseapp.com",
    projectId: "neuro-grade-9a10e",
    storageBucket: "neuro-grade-9a10e.firebasestorage.app",
    messagingSenderId: "927803449159",
    appId: "1:927803449159:web:424b3c90db0ebe3d38f662",
    measurementId: "G-Y17GEKL7R6"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
