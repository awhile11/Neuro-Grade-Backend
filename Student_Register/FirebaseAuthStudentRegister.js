// FirebaseAuthStudentRegister.js
import { 
  validateForm, 
  subjects, 
  generateStudentId, 
  showSuccessModal, 
  showErrorModal, 
  initStudentSubjects, 
  fetchTeacherNames, 
  fetchTeacherSubjects 
} from "../services/student-services.js";

import { auth, db } from "../services/firebase-init.js";
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";
import { setDoc, doc } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", async () => {
  initStudentSubjects();

  const form = document.getElementById("registrationForm");
  const teacherIdNumber = document.getElementById("StudentIdNumber");
  const successModal = document.getElementById("successModal");
  const modalOkBtn = document.getElementById("modalOkBtn");
  const errorModal = document.getElementById("errorModal");
  const errorOkBtn = document.getElementById("errorOkBtn");
  const teacherSelect = document.getElementById("teacher");
  const subjectInput = document.getElementById("subject");

  // Fetch teacher names and populate dropdown
  const teacherNames = await fetchTeacherNames();
  if (teacherNames.length > 0) {
    teacherNames.forEach((name) => {
      const option = document.createElement("option");
      option.value = name;
      option.textContent = name;
      teacherSelect.appendChild(option);
    });
  } else {
    const option = document.createElement("option");
    option.textContent = "No teachers available";
    teacherSelect.appendChild(option);
  }

  // Update subjects when teachers are selected
  teacherSelect.addEventListener("change", async () => {
    const selectedTeachers = Array.from(teacherSelect.selectedOptions).map(option => option.value);
    let combinedSubjects = [];

    for (const teacherName of selectedTeachers) {
      const teacherSubjects = await fetchTeacherSubjects(teacherName);
      combinedSubjects.push(...teacherSubjects);
    }

    // Remove duplicates
    combinedSubjects = [...new Set(combinedSubjects)];

    // Update shared subjects array
    subjects.length = 0;
    subjects.push(...combinedSubjects);

    // Update subject input field (read-only)
    subjectInput.value = combinedSubjects.join(", ");
    subjectInput.readOnly = combinedSubjects.length > 0;

    // Update the subject list UI
    const subjectList = document.getElementById("subjectList");
    const noSubjects = document.getElementById("noSubjects");
    if (subjectList && noSubjects) {
      noSubjects.style.display = combinedSubjects.length === 0 ? "block" : "none";
      subjectList.innerHTML = "";
      combinedSubjects.forEach((subject, index) => {
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
    }
  });

  // Handle form submission
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const firstName = document.getElementById("firstName").value.trim();
    const lastName = document.getElementById("lastName").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const selectedTeachers = Array.from(teacherSelect.selectedOptions).map(option => option.value);

    if (subjects.length === 0) {
      showErrorModal("Please add at least one subject before registering.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      const studentId = generateStudentId();

      await setDoc(doc(db, "students", uid), {
        firstName,
        lastName,
        email,
        subjects,
        teacherNames: selectedTeachers,
        role: "student",
        createdAt: new Date(),
      });

      showSuccessModal(`${firstName} ${lastName} created successfully`);
      successModal.style.display = "flex";
    } catch (error) {
      console.error(error);
      if (error.code === "auth/email-already-in-use") {
        showErrorModal("This email is already registered. Please log in instead.");
      } else {
        showErrorModal(error.message);
      }
    }
  });

  errorOkBtn.addEventListener("click", () => {
    errorModal.style.display = "none";
  });

  modalOkBtn.addEventListener("click", () => {
    successModal.style.display = "none";
    window.location.href = "login.html";
  });
});
