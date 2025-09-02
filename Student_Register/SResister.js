// ✅ Firebase Modular SDK imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-analytics.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-database.js";

console.log("SRegister.js is loaded!");

// ✅ Firebase config
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

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getDatabase(app);

// ✅ Form & modal references
const form = document.getElementById("registrationForm");
const subjectInput = document.getElementById("subject");
const addSubjectBtn = document.getElementById("addSubject");
const subjectList = document.getElementById("subjectList");
const noSubjects = document.getElementById("noSubjects");
const successModal = document.getElementById("successModal");
const generatedStudentNumber = document.getElementById("generatedStudentNumber");
const modalOkBtn = document.getElementById("modalOkBtn");

let subjects = [];

// 🔹 Generate random 9-digit student number
function generateStudentNumber() {
  return Math.floor(100000000 + Math.random() * 900000000).toString();
}

// 🔹 Update subject list in the UI
function updateSubjectList() {
  if (subjects.length === 0) {
    noSubjects.style.display = "block";
    return;
  }
  noSubjects.style.display = "none";
  subjectList.innerHTML = "";
  subjects.forEach((subj, index) => {
    const subjectItem = document.createElement("div");
    subjectItem.className = "subject-item";
    subjectItem.innerHTML = `
      <span>${subj}</span>
      <button type="button" class="remove-btn" data-index="${index}">
        <i class="fas fa-times"></i>
      </button>
    `;
    subjectList.appendChild(subjectItem);
  });

  // Add remove button functionality
  const removeButtons = document.querySelectorAll(".remove-btn");
  removeButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const index = parseInt(btn.getAttribute("data-index"));
      subjects.splice(index, 1);
      updateSubjectList();
    });
  });
}

// 🔹 Add subject from input
function addSubject() {
  const name = subjectInput.value.trim();
  if (name === "") return alert("Please enter a subject name");
  if (subjects.includes(name)) return alert("This subject is already added");
  subjects.push(name);
  updateSubjectList();
  subjectInput.value = "";
  subjectInput.focus();
}

// 🔹 Validate form
function validateForm() {
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  const email = document.getElementById("email").value;
  const teacher = document.getElementById("teacher").value.trim();
  
  if (password !== confirmPassword) {
    alert("Passwords do not match");
    return false;
  }
  if (subjects.length === 0) {
    alert("Please add at least one subject");
    return false;
  }
  if (teacher === "") {
    alert("Please enter your teacher's name");
    return false;
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    alert("Please enter a valid email");
    return false;
  }
  return true;
}

// 🔹 Show success modal
function showSuccessModal(studentNumber) {
  generatedStudentNumber.textContent = studentNumber;
  successModal.style.display = "flex";
}

// 🔹 Event listeners
addSubjectBtn.addEventListener("click", addSubject);
subjectInput.addEventListener("keypress", e => {
  if (e.key === "Enter") {
    e.preventDefault();
    addSubject();
  }
});

form.addEventListener("submit", async e => {
  e.preventDefault();
  if (!validateForm()) return;

  try {
    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const teacher = document.getElementById("teacher").value;
    const studentNumber = generateStudentNumber();

    // 🔹 Create user in Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // 🔹 Save student data in Realtime Database
    await set(ref(db, "students/" + user.uid), {
      firstName,
      lastName,
      email,
      teacher,
      subjects,
      studentNumber,
      createdAt: new Date().toISOString()
    });

    // 🔹 Show success modal
    showSuccessModal(studentNumber);

    // Reset form
    form.reset();
    subjects = [];
    updateSubjectList();

  } catch (error) {
    alert("Error: " + error.message);
    console.error(error);
  }
});

// 🔹 Close modal
modalOkBtn.addEventListener("click", () => {
  successModal.style.display = "none";
});
