// FirebaseAuthTeacherRegister.js

// import { auth, db } from "./teacher-services/firebase-init.js";
// import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";
// import { setDoc, doc } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

import { validateForm, subjects,generateTeacherId, showSuccessModal, showErrorModal,initTeacherSubjects  } from "../services/teacher-services.js";
import { auth, db } from "../services/firebase-init.js";
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";
import { setDoc, doc } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

<<<<<<< HEAD
=======
//  Validate form fields
>>>>>>> 52fb1474f1a9a875b8303fa978b593f28c41fa8f
document.addEventListener("DOMContentLoaded", () => {
  initTeacherSubjects();
  const form = document.getElementById("registrationForm");
  const teacherIdNumber = document.getElementById("teacherIdNumber");
  const successModal = document.getElementById("successModal");
  const modalOkBtn = document.getElementById("modalOkBtn");
  const errorModal = document.getElementById("errorModal");
  const errorOkBtn = document.getElementById("errorOkBtn");

//  Handle form submission
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!validateForm()) return;
    
    const firstName = document.getElementById("firstName").value.trim();
    const lastName = document.getElementById("lastName").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

   // Ensure at least one subject is added 
    if (subjects.length === 0) {
      showErrorModal("Please add at least one subject before registering.");
      return;
    }

    try {
      // 1. Create teacher in Auth
      console.log("Creating teacher account...");//for testing purposes
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      // 2. Generate teacher ID
      const teacherId = generateTeacherId();

      // 3. Save teacher in Firestore (includes subjects)
      console.log("Saving teacher in Firestore...");//for testing purposes
      await setDoc(doc(db, "teachers", uid), {
        firstName,
        lastName,
        email,
        subjects, //  Store teacher’s subjects
        teacherId,
        role: "teacher",
        createdAt: new Date(), 
      });
      console.log("User created:", userCredential.user.uid);

      // 4. Show success modal 
      showSuccessModal(firstName+" " +lastName+ "created successfully");
      teacherIdNumber.textContent = teacherId;
      successModal.style.display = "flex";
    } 

    catch (error) 
    {
      console.error(error);
      if (error.code === "auth/email-already-in-use") 
        {
          showErrorModal("This email is already registered. Please log in instead.");
        }
        else{
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
