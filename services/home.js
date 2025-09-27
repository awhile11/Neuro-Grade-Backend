import { getCurrentTeacher } from "./auth-service.js";
import { getFirestore, collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";
import {app, auth, db} from "./firebase-init.js";
import { showErrorModal } from "./teacher-services.js";


document.addEventListener("DOMContentLoaded", async () => {
  try {
    const teacher = await getCurrentTeacher();

     // Update top user info
    document.querySelector(".top-user span").innerHTML = `<b>${teacher.firstName}</b><br><small>${teacher.email}</small>`;
    if (teacher.profilePic) {
      document.querySelector(".top-user img").src = teacher.profilePic;
    }

    // Update welcome box
    document.querySelector(".welcome-box h1").textContent = `WELCOME BACK, ${teacher.firstName.toUpperCase()} ${teacher.lastName.toUpperCase()}!`;


  

    // Load subjects for this teacher
const container = document.getElementById("subjects-container");
container.innerHTML = "";

if (!teacher.subjects || teacher.subjects.length === 0) {
  container.innerHTML = `
    <div class="empty-state">
      <i class="fas fa-book-open"></i>
      <p>No subjects yet</p>
      <p>Subjects will be loaded from your database</p>
    </div>
  `;
} else {
  teacher.subjects.forEach(subj => {
    const div = document.createElement("div");
    div.className = "subject-item";
    div.innerHTML = `
      <div class="subject-info">
        <h3>${subj}</h3>
        <p>--</p>
      </div>
      <div class="subject-actions">
        <button class="edit-btn">Edit</button>
        <button class="delete-btn">Delete</button>
      </div>
    `;
    container.appendChild(div);
  });
}

    // TODO: load students, messages, notifications (teacher-based collections)

  } catch (err) {
    console.log("Something went wrong:",err);
    showErrorModal(err);
    
    //window.location.href = "../Neuro-Grade-Frontend/login.html"; // redirect if not teacher
  }
});
