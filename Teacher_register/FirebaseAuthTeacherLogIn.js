// FirebaseAuthTeacherLogIn.js
import { auth, db } from "../services/firebase-init.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";
import { showErrorModal } from "../services/teacher-services.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {
  const teacherForm = document.getElementById("teacherForm");

  teacherForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("teacherEmail").value.trim();
    const password = document.getElementById("teacherPassword").value.trim();

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      // Check role in Firestore
      const teacherDoc = await getDoc(doc(db, "teachers", uid));
      if (teacherDoc.exists()) {
        console.log("Teacher logged in:", teacherDoc.data());
        window.location.href = "teacher-home-page.html";
      } else {
        showErrorModal("This account is not a teacher.");
      }
    } catch (error) {
      showErrorModal("Login failed: " + error.message);
      console.error(error);
      
      
    }
  });
});
