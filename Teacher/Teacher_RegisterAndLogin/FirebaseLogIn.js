   import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
   import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

    const firebaseConfig = {
    apiKey: "AIzaSyB_jkCjYBpGzkwxtLmC6DKF7g0xxAAUPck",
    authDomain: "neuro-grade-aefa0.firebaseapp.com",
    projectId: "neuro-grade-aefa0",
    storageBucket: "neuro-grade-aefa0.firebasestorage.app",
    messagingSenderId: "301322876081",
    appId: "1:301322876081:web:c3fd4b8302da63462e5e90"
  };

    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);

    const container = document.getElementById('container');
    const teacherBtn = document.querySelector('.teacher-btn');
    const studentBtn = document.querySelector('.student-btn');
    const studentForm = document.getElementById('studentForm');
    const teacherForm = document.getElementById('teacherForm');
    const passwordInput = document.getElementById('teacherPassword');
    const toggleIcon = document.getElementById('teacherPasswordToggle');

    toggleIcon.addEventListener('click', () => {
      const isPassword = passwordInput.type === 'password';
      passwordInput.type = isPassword ? 'text' : 'password';
      toggleIcon.classList.toggle('fa-eye');
      toggleIcon.classList.toggle('fa-eye-slash');
    });


    // Toggle between student and teacher login
    teacherBtn.addEventListener('click', () => {
      container.classList.add('active');
    });

    studentBtn.addEventListener('click', () => {
      container.classList.remove('active');
    });

    // Form validation
    function validateEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    }

    function showError(inputElement, message) {
      const inputBox = inputElement.closest('.input-box');
      const errorMessage = inputBox.querySelector('.error-message');
      
      inputBox.classList.add('error');
      errorMessage.textContent = message;
      errorMessage.style.display = 'block';
      
      // Remove error after user starts typing
      inputElement.addEventListener('input', function removeError() {
        inputBox.classList.remove('error');
        errorMessage.style.display = 'none';
        inputElement.removeEventListener('input', removeError);
      });
    }

    // Student form submission
    studentForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const studentNumber = document.getElementById('studentNumber').value;
      const password = document.getElementById('studentPassword').value;

    if (!studentNumber) {
      showError(document.getElementById('studentNumber'), 'Student number is required');
      return;
    }
    if (!password) {
      showError(document.getElementById('studentPassword'), 'Password is required');
      return;
    }

    // Treat studentNumber as email
    const email = `${studentNumber}@students.neurograde.com`;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert('Student login successful!');
      window.location.href = 'student-dashboard.html'; // redirect to student dashboard
    } catch (error) {
      alert(error.message);
    }
  });

    // Teacher form submission
    teacherForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('teacherEmail').value.trim();
      const password = document.getElementById('teacherPassword').value;

    if (!email) {
      showError(document.getElementById('teacherEmail'), 'Email is required');
      return;
    }
    if (!validateEmail(email)) {
      showError(document.getElementById('teacherEmail'), 'Please enter a valid email address');
      return;
    }
    if (!password) {
      showError(document.getElementById('teacherPassword'), 'Password is required');
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert('Teacher login successful!');
      window.location.href = 'HomePage.html'; // redirect to teacher dashboard
    } catch (error) {
      alert(error.message);
    }
  });

    // Add smooth focus effects
    document.querySelectorAll('.input-box input').forEach(input => {
    input.addEventListener('focus', () => input.parentElement.style.transform = 'scale(1.02)');
    input.addEventListener('blur', () => input.parentElement.style.transform = 'scale(1)');
    });

// Forgot Password Logic
    document.getElementById("forgotPasswordLink").addEventListener("click", (e) => {
   e.preventDefault();
  document.getElementById("forgotPasswordModal").style.display = "block";
});

document.querySelector(".close").addEventListener("click", () => {
  document.getElementById("forgotPasswordModal").style.display = "none";
});

// Forgot password email sending
document.getElementById("resetBtn").addEventListener("click", async () => {
  const resetEmail = document.getElementById("resetEmail").value.trim();
  const resetMessage = document.getElementById("resetMessage");
  const resetError = document.getElementById("resetError");

  resetMessage.style.display = "none";
  resetError.style.display = "none";

  if (!resetEmail) {
    resetError.textContent = "Email is required";
    resetError.style.display = "block";
    return;
  }
  if (!validateEmail(resetEmail)) {
    resetError.textContent = "Please enter a valid email address";
    resetError.style.display = "block";
    return;
  }

  try {
    await sendPasswordResetEmail(auth, resetEmail);
    resetMessage.style.display = "block";
    resetMessage.textContent = "Password reset email sent successfully!";
  } catch (error) {
    resetError.style.display = "block";
    resetError.textContent = error.message;
  }
});

