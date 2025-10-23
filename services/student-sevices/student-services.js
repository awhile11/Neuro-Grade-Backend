// student-services.js
import { getDocs, collection } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";
import { db } from "../firebase-init.js";
// Shared subjects array
export let subjects = [];

// Generate a random teacher ID
export function generateStudentId() {
  return Math.floor(10000 + Math.random() * 90000).toString();
}

// Show success modal
export function showSuccessModal(studentId) {
  const studentIdNumber = document.getElementById("studentIdNumber");
  const successModal = document.getElementById("successModal");
  if (!studentIdNumber || !successModal) return;

  studentIdNumber.textContent = studentId;
  successModal.style.display = "flex";
}

// Show error modal
export function showErrorModal(message) {
  const modal = document.getElementById("errorModal");
  if (!modal) return;

  modal.querySelector(".modal-icon i").className = "fas fa-times-circle";
  modal.querySelector(".modal-icon").style.color = "red";
  modal.querySelector("h2").textContent = "Error!";
  modal.querySelector(".modal-message").textContent = message;

  const generatedStudentId = document.getElementById("generatedStudentId");
  if (generatedStudentId) generatedStudentId.style.display = "none";

  modal.style.display = "flex";
}

// Validate form
export function validateForm() {
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  const email = document.getElementById("email").value;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (password !== confirmPassword) {
    showErrorModal("Passwords do not match");
    return false;
  }
  if (subjects.length === 0) {
    showErrorModal("Please add at least one subject you study");
    return false;
  }
  if (!emailRegex.test(email)) {
    showErrorModal("Please enter a valid email address");
    return false;
  }

  const errorModal = document.getElementById("errorModal");
  const errorOkBtn = document.getElementById("errorOkBtn");
  if (errorOkBtn && errorModal) {
    errorOkBtn.addEventListener("click", function () {
      errorModal.style.display = "none";
    });
  }

  return true;
}

// DOM-dependent setup wrapped in a function
export function initStudentSubjects() {
  const subjectInput = document.getElementById("subject");
  const addSubjectBtn = document.getElementById("addSubject");
  const subjectList = document.getElementById("subjectList");
  const noSubjects = document.getElementById("noSubjects");

  if (!subjectInput || !addSubjectBtn || !subjectList || !noSubjects) return;

  function updateSubjectList() {
    if (subjects.length === 0) {
      noSubjects.style.display = "block";
      subjectList.innerHTML = "";
      return;
    }
    noSubjects.style.display = "none";
    subjectList.innerHTML = "";

    subjects.forEach((subject, index) => {
      const subjectItem = document.createElement("div");
      subjectItem.className = "subject-item";
      subjectItem.innerHTML = `
        <span>${subject}</span>
        <button type="button" class="remove-btn" data-index="${index}">
          <i class="fas fa-times"></i>
        </button>
      `;
      subjectList.appendChild(subjectItem);
    });

    subjectList.querySelectorAll(".remove-btn").forEach((button) => {
      button.addEventListener("click", function () {
        const index = parseInt(this.getAttribute("data-index"));
        subjects.splice(index, 1);
        updateSubjectList();
      });
    });
  }

  function addSubject() {
    const subjectName = subjectInput.value.trim();
    if (!subjectName) return showErrorModal("Please enter a subject name");
    if (subjects.includes(subjectName)) return showErrorModal("This subject has already been added");

    subjects.push(subjectName);
    updateSubjectList();
    subjectInput.value = "";
    subjectInput.focus();
  }

  addSubjectBtn.addEventListener("click", addSubject);
  subjectInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSubject();
    }
  });

  // Initialize list
  updateSubjectList();
}
// Fetch teacher names from Firestore
export async function fetchTeacherNames() {
  const teacherNames = [];
  try {
    const querySnapshot = await getDocs(collection(db, "teachers"));
    querySnapshot.forEach((doc) => {
      const teacherData = doc.data();
      teacherNames.push(teacherData.firstName + " " + teacherData.lastName); // Push full name to the array
    });
  } catch (error) {
    console.error("Error fetching teacher names: ", error);
  }
  return teacherNames;
}
// Fetch subjects for a given teacher
// Fetch subjects for one or multiple teachers
export async function fetchTeacherSubjects(teacherNames) {
  const subjects = [];
  try {
    const teachersRef = collection(db, "teachers");
    const querySnapshot = await getDocs(teachersRef);

    querySnapshot.forEach((doc) => {
      const teacherData = doc.data();
      const fullName = teacherData.firstName + " " + teacherData.lastName;

      // Check if this teacher is in the array
      if (Array.isArray(teacherNames) && teacherNames.includes(fullName)) {
        if (Array.isArray(teacherData.subjects)) {
          subjects.push(...teacherData.subjects);
        }
      } else if (typeof teacherNames === "string" && fullName === teacherNames) {
        if (Array.isArray(teacherData.subjects)) {
          subjects.push(...teacherData.subjects);
        }
      }
    });
  } catch (error) {
    console.error("Error fetching teacher subjects: ", error);
  }
  // Remove duplicates
  return [...new Set(subjects)];
}



// Automatically initialize subjects UI on DOM load
document.addEventListener("DOMContentLoaded", initStudentSubjects);
