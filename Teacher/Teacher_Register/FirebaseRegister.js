// FirebaseRegister.js
import { registerUser } from "./firebaseAuth.js";
import { saveTeacherData } from "./firebaseFirestore.js";
import { generateTeacherId, validateForm, showSuccessModal, updateSubjectList } from "./firebaseFunctions.js";

document.addEventListener("DOMContentLoaded", () => {
  const subjectInput = document.getElementById("subject");
  const addSubjectBtn = document.getElementById("addSubject");
  const subjectList = document.getElementById("subjectList");
  const noSubjects = document.getElementById("noSubjects");
  const submitSignUp = document.getElementById("submitSignUp");
  const successModal = document.getElementById("successModal");
  const teacherIdNumber = document.getElementById("teacherIdNumber");
  const modalOkBtn = document.getElementById("modalOkBtn");

  let subjects = [];

  // ➕ Add Subject
  addSubjectBtn.addEventListener("click", () => {
    const subjectName = subjectInput.value.trim();
    if (!subjectName) return alert("Please enter a subject name");
    if (subjects.some(s => s.toLowerCase() === subjectName.toLowerCase()))
      return alert("This subject has already been added");

    subjects.push(subjectName);
    updateSubjectList(subjects, subjectList, noSubjects);
    subjectInput.value = "";
    subjectInput.focus();
  });

  // ➖ Remove Subject
  subjectList.addEventListener("click", (e) => {
    if (e.target.closest(".remove-btn")) {
      const index = parseInt(e.target.closest(".remove-btn").dataset.index);
      subjects.splice(index, 1);
      updateSubjectList(subjects, subjectList, noSubjects);
    }
  });

  // 🧾 Handle Form Submission
  submitSignUp.addEventListener("click", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim().toLowerCase();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const firstName = document.getElementById("firstName").value.trim();
    const lastName = document.getElementById("lastName").value.trim();

    if (!validateForm(password, confirmPassword, email, subjects)) return;

    const teacherId = generateTeacherId();
    submitSignUp.disabled = true;

    try {
      const user = await registerUser(email, password);

      await saveTeacherData(user.uid, {
        email,
        name: `${firstName} ${lastName}`,
        firstName,
        lastName,
        subjects,
        teacherId
      });

      showSuccessModal(successModal, teacherIdNumber, teacherId);
    } catch (error) {
      console.error("❌ Registration error:", error);
      alert(error.message);
    } finally {
      submitSignUp.disabled = false;
    }
  });

  // ✅ Continue to login
  modalOkBtn.addEventListener("click", () => {
    successModal.style.display = "none";
    window.location.href = "LogIn.html";
  });
});
