import { monitorAuthState, logoutUser } from "./FirebaseAuth.js";
import { getTeacherData } from "./FirebaseFirestore.js";
import { renderSubjects, loadStudents, updateClassAverage } from "./FirebaseFunctions.js";
import { getProfileImage } from "./FirebaseStorage.js";

document.addEventListener("DOMContentLoaded", () => {

  monitorAuthState(async (user) => {
    try {
      const teacherData = await getTeacherData(user.uid);

      if (teacherData) {
        document.getElementById("teacher-name").textContent = teacherData.name;
        document.getElementById("teacher-email").textContent = teacherData.email;
        document.getElementById("welcome-message").textContent = `WELCOME BACK, ${teacherData.name.toUpperCase()}!`;
      }

      // Load profile image
      const profileEl = document.getElementById("teacher-profile");
      if (profileEl) {
        const url = await getProfileImage(user.uid);
        if (url) profileEl.src = url;
      }

      // Load dashboard data
      const students = await loadStudents();
      await renderSubjects();
      updateClassAverage(students);

    } catch (err) {
      console.error("Error loading dashboard:", err);
    }
  });

  document.getElementById("logoutBtn").addEventListener("click", logoutUser);
});
// FirebaseDashboard.js

// 🔹 Import Firebase authentication & database utilities
import { monitorAuthState, logoutUser } from "./FirebaseAuth.js";
import { getTeacherData, fetchSubjects, fetchStudentData } from "./FirebaseFirestore.js";
import { loadSubjects, loadStudents, updateClassAverage, renderSubjects } from "./FirebaseFunctions.js";

// 🔸 Wait for the DOM to load before executing
document.addEventListener("DOMContentLoaded", async () => {

  // 🧭 Monitor Firebase Authentication state
  monitorAuthState(async (user) => {

    try {
      // 🧑‍🏫 Fetch teacher profile data from Firestore
      const teacherData = await getTeacherData(user.uid);

      // 🪪 Display teacher info on top bar and welcome section
      if (teacherData) {
        const nameEl = document.getElementById("teacher-name");
        const emailEl = document.getElementById("teacher-email");
        const welcomeEl = document.getElementById("welcome-message");


        if (nameEl) nameEl.textContent = teacherData.name;
        if (emailEl) emailEl.textContent = teacherData.email;
        if (welcomeEl) welcomeEl.textContent = `WELCOME BACK, ${teacherData.name.toUpperCase()}!`;

      } else {
        const welcomeTitleEl = document.querySelector(".welcome-box");
        if (welcomeTitleEl) welcomeTitleEl.textContent = "WELCOME BACK, TEACHER!";
      }

      // 🕒 (Optional) Show loading animation or message
      const loader = document.getElementById("dashboardLoader");
      if (loader) loader.style.display = "block";

      // 📊 Fetch students and subjects concurrently
      const [students, subjects] = await Promise.all([
        fetchStudentData(),
        fetchSubjects()
      ]);

      // 🧮 Update dashboard visuals
      updateClassAverage(students, null);
      renderSubjects(subjects);

      // ✅ Hide loader when data is ready
      if (loader) loader.style.display = "none";

    } catch (err) {
      console.error("❌ Error initializing dashboard:", err);
      const errorBox = document.getElementById("errorBox");
      if (errorBox) errorBox.textContent = "Failed to load dashboard data. Please refresh.";
    }
  });

  // 🚪 Handle logout button click
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) logoutBtn.addEventListener("click", logoutUser);
});
