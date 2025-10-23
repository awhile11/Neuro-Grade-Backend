import 
{ 
  fetchStudents,
  fetchStudentData,
  loadStudentsFromDatabase, 
  loadTestData,
  initCharts,
  updateCharts
} from '../auth-service.js';
//import { db } from '../firebase-init.js'; // Assuming you have the firebase-init.js file to initialize Firestore
import { getDocs, collection, getDoc, doc } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", function () {
  let assignmentsChart, testsChart, overallGradeChart;
  // Fetch student data when the page is loaded
  loadStudentsFromDatabase();
  fetchStudentData();
  loadTestData();
  updateCharts();
  console.log("Fetching students for teacher...");

  // Handle tab switching and data loading
  document.querySelectorAll(".tab-btn").forEach(tab => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".tab-btn").forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      let tabName = tab.dataset.tab;
      document.querySelectorAll(".tab-content").forEach(c => c.style.display = "none");
      document.getElementById(tabName).style.display = "block";
      
      const activeStudent = document.querySelector(".student-item.active");
      if (activeStudent) {
        loadTabData(tabName, activeStudent.dataset.studentId);
      }
    });
  });
  // Initialize page
  initCharts();
});
