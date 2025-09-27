// FirebaseAuthTeacherLogIn.js
import { auth, db } from "../services/firebase-init.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";
import { showErrorModal } from "../services/teacher-services.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

export function getCurrentUser() {
  const auth = getAuth();
  return auth.currentUser; 
}


document.addEventListener("DOMContentLoaded", () => {
  const teacherForm = document.getElementById("teacherForm");

  teacherForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const errorOkBtn = document.getElementById("errorOkBtn")
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
    } 
    catch (error) 
    {
      let message = "Login failed.";
      if (error.code === "auth/user-not-found") 
        {
          message = "No account found with this email.";
        } 
      else if (error.code === "auth/wrong-password" || error.code === "auth/invalid-credential") 
        {
          message = "Incorrect username or/and password . Try again.";
        }
      showErrorModal(message);
      console.error(error);
      
    }
    errorOkBtn.addEventListener("click", () => {
    errorModal.style.display = "none";
  }); 
  });
});
