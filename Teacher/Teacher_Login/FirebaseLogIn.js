// FirebaseLogin.js
import { loginUser, resetPassword } from "./firebaseAuth.js";
import { validateEmail, showError, togglePasswordVisibility } from "./firebaseLoginFunctions.js";

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('container');
  const teacherBtn = document.querySelector('.teacher-btn');
  const studentBtn = document.querySelector('.student-btn');
  const studentForm = document.getElementById('studentForm');
  const teacherForm = document.getElementById('teacherForm');

  // Toggle between student and teacher login
  teacherBtn.addEventListener('click', () => container.classList.add('active'));
  studentBtn.addEventListener('click', () => container.classList.remove('active'));

  // Show/hide teacher password
  togglePasswordVisibility("teacherPasswordToggle", "teacherPassword");

  // Student login
  studentForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const studentNumber = document.getElementById('studentNumber').value.trim();
    const password = document.getElementById('studentPassword').value;

    if (!studentNumber) return showError(document.getElementById('studentNumber'), 'Student number is required');
    if (!password) return showError(document.getElementById('studentPassword'), 'Password is required');

    const email = `${studentNumber}@students.neurograde.com`;

    try {
      await loginUser(email, password);
      window.location.href = 'student-dashboard.html';
    } catch (err) {
      alert(err.message);
    }
  });

  // Teacher login
  teacherForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('teacherEmail').value.trim();
    const password = document.getElementById('teacherPassword').value;

    if (!email) return showError(document.getElementById('teacherEmail'), 'Email is required');
    if (!validateEmail(email)) return showError(document.getElementById('teacherEmail'), 'Invalid email');
    if (!password) return showError(document.getElementById('teacherPassword'), 'Password is required');

    try {
      await loginUser(email, password);
      window.location.href = 'HomePage.html';
    } catch (err) {
      alert(err.message);
    }
  });

  // Forgot password modal
  const forgotLink = document.getElementById("forgotPasswordLink");
  const modal = document.getElementById("forgotPasswordModal");
  const closeBtn = modal.querySelector(".close");
  const resetBtn = document.getElementById("resetBtn");
  const resetEmailInput = document.getElementById("resetEmail");
  const resetMessage = document.getElementById("resetMessage");
  const resetError = document.getElementById("resetError");

  forgotLink.addEventListener('click', (e) => { e.preventDefault(); modal.style.display = "block"; });
  closeBtn.addEventListener('click', () => modal.style.display = "none");

  resetBtn.addEventListener('click', async () => {
    const email = resetEmailInput.value.trim();
    resetMessage.style.display = resetError.style.display = "none";

    if (!email) return showError(resetEmailInput, "Email is required");
    if (!validateEmail(email)) return showError(resetEmailInput, "Invalid email");

    try {
      await resetPassword(email);
      resetMessage.style.display = "block";
      resetMessage.textContent = "Password reset email sent successfully!";
    } catch (err) {
      resetError.style.display = "block";
      resetError.textContent = err.message;
    }
  });
});
