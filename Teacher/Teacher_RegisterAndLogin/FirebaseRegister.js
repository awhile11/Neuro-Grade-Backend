  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
  import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";
  import {getFirestore, setDoc, doc, serverTimestamp} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js"; 

  
  // Your web app's Firebase configuration
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
  const db = getFirestore(app);


    document.addEventListener('DOMContentLoaded', function() {
      const subjectInput = document.getElementById('subject');
      const addSubjectBtn = document.getElementById('addSubject');
      const subjectList = document.getElementById('subjectList');
      const noSubjects = document.getElementById('noSubjects');
      const form = document.getElementById('registrationForm');
      const successModal = document.getElementById('successModal');
      const teacherIdNumber = document.getElementById('teacherIdNumber');
      const modalOkBtn = document.getElementById('modalOkBtn');
      const submitSignUp = document.getElementById("submitSignUp");
      
      let subjects = [];
      
      // Function to generate a random teacher ID
      function generateTeacherId() {
        return Math.floor(10000 + Math.random() * 90000).toString();
      }
      
      // Function to add a subject
      function addSubject() {
        const subjectName = subjectInput.value.trim();
        
        if (subjectName === '') {
          alert('Please enter a subject name');
          return;
        }

        if (subjects.some(s => s.toLowerCase() === subjectName.toLowerCase())) {
          alert('This subject has already been added');
          return;
        }

        
        subjects.push(subjectName);
        updateSubjectList();
        
        // Clear the input
        subjectInput.value = '';
        subjectInput.focus();
      }
      
      // Function to update the subject list UI
      function updateSubjectList() {
        if (subjects.length === 0) {
          noSubjects.style.display = 'block';
          return;
        }
        
        noSubjects.style.display = 'none';
        
        // Clear the list first
        subjectList.innerHTML = '';
        
        // Add each subject to the list
        subjects.forEach((subject, index) => {
          const subjectItem = document.createElement('div');
          subjectItem.className = 'subject-item';
          subjectItem.innerHTML = `
            <span>${subject}</span>
            <button type="button" class="remove-btn" data-index="${index}">
              <i class="fas fa-times"></i>
            </button>
          `;
          subjectList.appendChild(subjectItem);
        });
        
        // Add event listeners to remove buttons
        const removeButtons = document.querySelectorAll('.remove-btn');
        removeButtons.forEach(button => {
          button.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            subjects.splice(index, 1);
            updateSubjectList();
          });
        });
      }
      
      // Function to validate the form
      function validateForm() {
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const email = document.getElementById('email').value;
        
        if (password !== confirmPassword) {
          alert('Passwords do not match');
          return false;
        }
        
        if (subjects.length === 0) {
          alert('Please add at least one subject you teach');
          return false;
        }
        
        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          alert('Please enter a valid email address');
          return false;
        }
        
        return true;
      }
      
      // Function to show success modal
      function showSuccessModal(teacherId) {
        teacherIdNumber.textContent = teacherId;
        successModal.style.display = 'flex';
      }
      
      // Event listeners
      addSubjectBtn.addEventListener('click', addSubject);
      
      subjectInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
          e.preventDefault();
          addSubject();
        }
      });
      
      submitSignUp.addEventListener("click", async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;

         const email = document.getElementById("email").value.trim().toLowerCase();
         const password = document.getElementById("password").value;
         const firstName = document.getElementById("firstName").value.trim();
         const lastName = document.getElementById("lastName").value.trim();
         const teacherId = generateTeacherId();

      try {

        submitSignUp.disabled = true;


        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Save teacher data in Firestore
        await setDoc(doc(db, "teachers", user.uid), {
          email: email,
          name: `${firstName} ${lastName}`,
          firstName: firstName,
          lastName: lastName,
          subjects: subjects,
          teacherId: teacherId,
          createdAt: new Date()

          
        });

        showSuccessModal(teacherId);


      } catch (error) {
        console.error(error);
        alert(error.message);
      } finally {
        submitSignUp.disabled = false;
      }
    });

      modalOkBtn.addEventListener('click', function() {
        successModal.style.display = 'none';
        // In a real application, you would redirect to login page
         window.location.href = 'LogIn.html';
      });
    

    // 🔹 Show/Hide Password Feature 🔹
  const passwordToggle = document.getElementById("passwordToggle");
  const confirmPasswordToggle = document.getElementById("confirmPasswordToggle");

  if (passwordToggle) {
    passwordToggle.addEventListener("click", function () {
      const passwordInput = document.getElementById("password");
      const type = passwordInput.getAttribute("type") === "password" ? "text" : "password";
      passwordInput.setAttribute("type", type);
      this.classList.toggle("fa-eye-slash");
    });
  }

  if (confirmPasswordToggle) {
    confirmPasswordToggle.addEventListener("click", function () {
      const passwordInput = document.getElementById("confirmPassword");
      const type = passwordInput.getAttribute("type") === "password" ? "text" : "password";
      passwordInput.setAttribute("type", type);
      this.classList.toggle("fa-eye-slash");
    });
  }
});