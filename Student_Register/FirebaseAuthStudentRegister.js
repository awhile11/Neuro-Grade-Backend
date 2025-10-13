// FirebaseAuthStudentRegister.js
import { validateForm, subjects,generateStudentId, showSuccessModal, showErrorModal,initStudentSubjects ,fetchTeacherNames,fetchTeacherSubjects   } from "../services/student-services.js";
import { auth, db } from "../services/firebase-init.js";
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";
import { setDoc, doc } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

//  Validate form fields
document.addEventListener("DOMContentLoaded", async() => {
  initStudentSubjects();
  
  const form = document.getElementById("registrationForm");
  const teacherIdNumber = document.getElementById("StudentIdNumber");
  const successModal = document.getElementById("successModal");
  const modalOkBtn = document.getElementById("modalOkBtn");
  const errorModal = document.getElementById("errorModal");
  const errorOkBtn = document.getElementById("errorOkBtn");
  const teacherField = document.getElementById("teacher"); // Teacher input field
   const teacherNames = await fetchTeacherNames();

   // Populate teacher dropdown
  if (teacherNames.length > 0) {
    // Create options for the teacher dropdown
    teacherNames.forEach((name) => {
      const option = document.createElement("option");
      option.value = name;
      option.textContent = name;
      teacherField.appendChild(option);  // Append each teacher name as an option
    });
  } else {
    // If no teachers are found, display an error or message
    const option = document.createElement("option");
    option.textContent = "No teachers available";
    teacherField.appendChild(option);
  }
// Update subjects when a teacher is selected
  teacherField.addEventListener("change", async () => {
  const selectedTeacher = teacherField.value;
  if (selectedTeacher && selectedTeacher !== "No teachers available") {
    const teacherSubjects = await fetchTeacherSubjects(selectedTeacher);
    subjects.length = 0;
    subjects.push(...teacherSubjects);
    
// Update the subject list UI
    const subjectList = document.getElementById("subjectList");
    const noSubjects = document.getElementById("noSubjects");
    if (subjectList && noSubjects) {
      noSubjects.style.display = teacherSubjects.length === 0 ? "block" : "none";
      subjectList.innerHTML = "";
      teacherSubjects.forEach((subject, index) => {
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
  }
});


//  Handle form submission
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!validateForm()) return;
    
    const firstName = document.getElementById("firstName").value.trim();
    const lastName = document.getElementById("lastName").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const selectedTeacher = teacherField.value;

   // Ensure at least one subject is added 
    if (subjects.length === 0) {
      showErrorModal("Please add at least one subject before registering.");
      return;
    }

    try {
      // 1. Create teacher in Auth
      console.log("Creating student account...");//for testing purposes
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      // 2. Generate teacher ID
      const teacherId = generateStudentId();

      // 3. Save teacher in Firestore (includes subjects)
      console.log("Saving student in Firestore...");//for testing purposes
      await setDoc(doc(db, "students", uid), {
        firstName,
        lastName,
        email,
        subjects, //  Store teacher’s subjects
        teacherName: selectedTeacher,
        role: "student",
        createdAt: new Date(), 
      });
      console.log("User created:", userCredential.user.uid);

      // 4. Show success modal 
      showSuccessModal(firstName+" " +lastName+ "created successfully");
      //teacherIdNumber.textContent = teacherId;
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
