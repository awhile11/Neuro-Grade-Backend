// teacher-services.js

// Shared subjects array
export let subjects = [];

// Generate a random teacher ID
export function generateTeacherId() {
  return Math.floor(10000 + Math.random() * 90000).toString();
}

// Show success modal
export function showSuccessModal(teacherId) {
  const teacherIdNumber = document.getElementById("teacherIdNumber");
  const successModal = document.getElementById("successModal");
  if (!teacherIdNumber || !successModal) return;

  teacherIdNumber.textContent = teacherId;
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

  const generatedTeacherId = document.getElementById("generatedTeacherId");
  if (generatedTeacherId) generatedTeacherId.style.display = "none";

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
    showErrorModal("Please add at least one subject you teach");
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
export function initTeacherSubjects() {
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

// Automatically initialize subjects UI on DOM load
document.addEventListener("DOMContentLoaded", initTeacherSubjects);
