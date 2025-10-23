
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";
import { getFirestore, doc, getDoc,collection, query, where, getDocs  } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";
import {app,auth,db,functions} from "./firebase-init.js";

// get current teacher
export async function getCurrentTeacher() {
  //
  return new Promise((resolve, reject) => {
    
    onAuthStateChanged(auth, async (user) => {
      if (!user) return reject("No user signed in");
      
      const ref = doc(db, "teachers", user.uid);
      const snap = await getDoc(ref);
// Check if teacher document exists
      if (!snap.exists()) return reject("Not a teacher");
// Resolve with teacher data
      resolve({ uid: user.uid, ...snap.data() });
    });
  });
}
// Function to save or update subject
export async function saveSubject(subjectData) {
  const url = subjectData.id ? `/api/subjects/${subjectData.id}` : '/api/subjects';
  const method = subjectData.id ? 'PUT' : 'POST';
// Make API call to save or update subject
  const response = await fetch(url, {
    method: method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(subjectData),
  });
// Check for response status
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
// Return the saved/updated subject data
  return await response.json();
}

// Function to get tests by teacher UID
export async function getTestsByTeacherUID() {
  const teacherUID = localStorage.getItem("teacherUID"); // Get the teacher UID from localStorage
  console.log("Fetching tests for teacher UID:", teacherUID);
  if (!teacherUID) {
    alert("Teacher not logged in!");
    return;
  }
// Fetch tests from Firestore where teacherUID matches
  try {
    const testsRef = collection(db, "tests");
    const q = query(testsRef, where("teacherUID", "==", teacherUID)); // Query for tests where teacherUID matches
// Execute the query
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.log("No tests found for this teacher.");
      return[];
    }
// Map the results to an array of test objects
    const tests = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
     console.log("Tests fetched:", tests);
    // Call function to display tests on UI
    return tests;

  } catch (error) {
    console.error("Error getting tests: ", error);
  }
}
// Function to display tests on the page
// Function to display the tests
export function displayTests(tests) {
  const testsList = document.querySelector('.tests');  // The container for test items

  // Clear any previously displayed tests
  testsList.innerHTML = '';

// Loop through the tests and create HTML elements for each
  if (tests && tests.length > 0) {
    
    tests.forEach(test => {
      const testDiv = document.createElement('div');
      testDiv.classList.add('test-item');
      testDiv.id = `test-${test.id}`;

      // Convert Firebase timestamp to a readable date format
      const createdAtDate = test.created_at ? new Date(test.created_at.seconds * 1000).toLocaleDateString() : 'N/A';

      // Build the test display
      testDiv.innerHTML = `
        <div class="test-info">
          <h4>${test.name}</h4>
          <small>${test.description || 'No description available.'}</small>
          <br>
          <small>Created at: ${createdAtDate}</small>
        </div>
        <div class="test-questions" style="display: none;">
          <!-- Questions will go here dynamically -->
        </div>
      `;

      // Add event listener to toggle visibility of questions
      testDiv.addEventListener('click', () => toggleTestQuestions(testDiv, test.questions));

      // Append the test div to the test list
      testsList.appendChild(testDiv);
    });
  } else {
    const noTestsMessage = document.createElement('p');
    noTestsMessage.textContent = 'No tests available.';
    testsList.appendChild(noTestsMessage);
  }
}

// Function to toggle the visibility of questions for a specific test
function toggleTestQuestions(testDiv, questions) {
  const questionsDiv = testDiv.querySelector('.test-questions');

  // If questions are not displayed, show them
  if (questionsDiv.style.display === 'none') {
    questionsDiv.style.display = 'block';

    // Check if questions are already displayed, if not, display them
    if (questionsDiv.innerHTML.trim() === '') {
      questions.forEach((question, index) => {
        const questionDiv = document.createElement('div');
        questionDiv.classList.add('question-item');
        questionDiv.innerHTML = `
          <p><strong>Q${question.order}:</strong> ${question.content}</p>
        `;
        questionsDiv.appendChild(questionDiv);
      });
    }
  } else {
    // If questions are displayed, hide them
    questionsDiv.style.display = 'none';
  }
}


// Function to get tests by title
export async function getTestsByTitle(title) {
  try {
    const testsRef = collection(db, "tests");
    const q = query(testsRef, where("name", "==", title));  // Query tests by title
    
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      console.log("No tests found with the specified title.");
      return [];
    }
    
    const tests = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    return tests;
  } catch (error) {
    console.error("Error fetching tests by title: ", error);
    return [];
  }
}

export async function fetchTestDetails(testId) {
  try {
    // Replace this with actual fetch from Firebase or wherever you store your test data
    const testData = await getTestFromDatabase(testId); // Use the appropriate function to fetch test data
    
    // Populate the test creation form
    testNameInput.value = testData.name;
    testDescriptionInput.value = testData.description;

    // Clear previous questions
    questionSection.innerHTML = '';

    // Populate questions
    testData.questions.forEach((question, index) => {
      const questionItem = document.createElement('div');
      questionItem.classList.add('question-item');
      questionItem.innerHTML = `
        <div class="question-title">
          <h3>QUESTION ${index + 1}</h3>
        </div>
        <div class="question-content">
          <textarea placeholder="Enter question content">${question}</textarea>
        </div>
      `;
      questionSection.appendChild(questionItem);
    });

  } catch (error) {
    console.error('Error fetching test details:', error);
  }
}
export function fetchStudents() {
    fetch('http://127.0.0.1:8000/api/students/') // The API endpoint
        .then(response => response.json())  // Parse the response into JSON
        .then(data => {
            displayStudents(data); // Call the function to display students
        })
        .catch(error => {
            console.error('Error fetching students:', error);
        });
}
export function fetchStudentData(studentId) {
    const studentDocRef = doc(db, "students", studentId);
    return getDoc(studentDocRef).then(docSnapshot => {
      if (docSnapshot.exists()) {
        return docSnapshot.data(); // return student data
      } else {
        console.error("No such student!");
        return {};
      }
    });
  }
export function displayStudents(students) {
    const studentList = document.getElementById("studentList");
    
    // Clear the student list before populating it
    studentList.innerHTML = '';

    students.forEach(student => {
        const studentItem = document.createElement("div");
        studentItem.classList.add("student-item");
        studentItem.innerHTML = `
            <div>${student.name} <span>${student.student_number}</span></div>
        `;

        // Add an event listener for each student item to highlight it when clicked
        studentItem.addEventListener("click", function() {
            // You can set this student as "active" or do something else
            document.querySelectorAll(".student-item").forEach(item => item.classList.remove("active"));
            studentItem.classList.add("active");

            // You can also load more data, e.g., grades or tests for the student
            loadStudentData(student.id);
        });

        studentList.appendChild(studentItem);
    });
}

export function loadStudentData(studentId) {
    // Use this function to fetch more data related to the selected student
    console.log('Load data for student with ID:', studentId);
    // You can fetch grades, tests, etc., here
}
export function loadStudentsFromDatabase() {
    const studentList = document.getElementById("studentList");
    studentList.innerHTML = `<div class="loading"><i class="fas fa-spinner"></i><p>Loading students from database...</p></div>`;
    
    const studentCollection = collection(db, "students");
    getDocs(studentCollection).then(snapshot => {
      const students = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      let studentsHTML = "";
      students.forEach((student, index) => {
        studentsHTML += `
          <div class="student-item ${index === 0 ? 'active' : ''}" data-student-id="${student.id}">
            ${student.firstName} ${student.lastName}<span>${student.studentNumber ? student.studentNumber.substring(0, 4) + '...' : 'No Number'}</span>
          </div>
        `;
      });

      studentList.innerHTML = studentsHTML;

      document.querySelectorAll(".student-item").forEach(stu => {
        stu.addEventListener("click", function() {
          document.querySelectorAll(".student-item").forEach(s => s.classList.remove("active"));
          this.classList.add("active");

          const studentId = this.dataset.studentId;
          const activeTab = document.querySelector(".tab-btn.active").dataset.tab;
          loadTabData(activeTab, studentId);
        });
      });
    }).catch(error => {
      console.error("Error fetching students from Firebase:", error);
      studentList.innerHTML = "<p>Failed to load students. Please try again later.</p>";
    });
  }
export function initCharts() {
    const monthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov"];
    
    // assignmentsChart = new Chart(document.getElementById('assignmentsChart'), {
    //   type: 'line',
    //   data: {
    //     labels: monthLabels,
    //     datasets: [{
    //       label: "Performance",
    //       data: Array(11).fill(0),
    //       borderColor: "#8e44ad",
    //       backgroundColor: "#8e44ad33",
    //       fill: true,
    //       tension: 0.3,
    //       pointBackgroundColor: "#8e44ad",
    //       pointBorderColor: "#fff",
    //       pointBorderWidth: 2,
    //       pointRadius: 4
    //     }]
    //   },
    //   options: { 
    //     plugins: { legend: { display: false } }, 
    //     scales: { 
    //       y: { 
    //         beginAtZero: true, 
    //         max: 100,
    //         grid: { color: 'rgba(0,0,0,0.05)' }
    //       },
    //       x: {
    //         grid: { color: 'rgba(0,0,0,0.05)' },
    //         ticks: {
    //           maxRotation: 0,
    //           callback: function(value, index) {
    //             return monthLabels[index];
    //           }
    //         }
    //       }
    //     } 
    //   }
    // });

    testsChart = new Chart(document.getElementById('testsChart'), {
      type: 'line',
      data: {
        labels: monthLabels,
        datasets: [{
          label: "Performance",
          data: Array(11).fill(0),
          borderColor: "#8e44ad",
          backgroundColor: "#8e44ad33",
          fill: true,
          tension: 0.3,
          pointBackgroundColor: "#8e44ad",
          pointBorderColor: "#fff",
          pointBorderWidth: 2,
          pointRadius: 4
        }]
      },
      options: { 
        plugins: { legend: { display: false } }, 
        scales: { 
          y: { 
            beginAtZero: true, 
            max: 100,
            grid: { color: 'rgba(0,0,0,0.05)' }
          },
          x: {
            grid: { color: 'rgba(0,0,0,0.05)' },
            ticks: {
              maxRotation: 0,
              callback: function(value, index) {
                return monthLabels[index];
              }
            }
          }
        } 
      }
    });

    overallGradeChart = new Chart(document.getElementById('overallGradeChart'), {
      type: 'doughnut',
      data: {
        labels: ["Grade","Remaining"],
        datasets: [{
          data: [0, 100],
          backgroundColor: ["#8e44ad","#eee"],
          borderWidth: 1,
          borderColor: "#fff",
          cutout: "75%"
        }]
      },
      options: { 
        plugins: { legend: { display: false } },
        elements: {
          arc: {
            borderWidth: 1,
            borderColor: '#fff'
          }
        }
      }
    });
  }
 export function updateCharts(studentId) {
    fetchStudentData(studentId).then(studentData => {
      // Update assignments chart
      // assignmentsChart.data.datasets[0].data = studentData.assignments;
      // assignmentsChart.update();
      
      // Update tests chart
      testsChart.data.datasets[0].data = studentData.tests;
      testsChart.update();
      
      // Update overall grade chart
      const overallGrade = studentData.overallGrade;
      overallGradeChart.data.datasets[0].data = [overallGrade, 100 - overallGrade];
      overallGradeChart.update();
      
      // Update grade text
      document.getElementById('gradeText').textContent = `${overallGrade}%`;
    });
  }
export function loadTestData(studentId) {
    const contentDiv = document.getElementById('tests');
    
    contentDiv.innerHTML = `<div class="loading"><i class="fas fa-spinner"></i><p>Loading test data from database...</p></div>`;
    
    setTimeout(() => {
      let tableHTML = `
        <table>
          <thead>
            <tr>
              <th>Test Name</th>
              <th>Date</th>
              <th>Status</th>
              <th>AI Grade</th>
              <th>Updated Grade</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colspan="5" style="text-align: center; padding: 20px;">
                Test data will be loaded from your database
              </td>
            </tr>
          </tbody>
        </table>
      `;
      contentDiv.innerHTML = tableHTML;
    }, 800);
  }

  // Fetch student data from Firebase



  // Load tab data dynamically based on selected tab
 export function loadTabData(tabName, studentId) {
    const contentDiv = document.getElementById(tabName);
    
    if (tabName === "grades") {
      updateCharts(studentId);
      return;
    } else if (tabName === "tests") {
      loadTestData(studentId);
      return;
    }

    contentDiv.innerHTML = `<div class="loading"><i class="fas fa-spinner"></i><p>Loading ${tabName} data from database...</p></div>`;
    
    setTimeout(() => {
      let tableHTML = `<table><thead><tr>`;
      
      if (tabName === "assignments") {
        tableHTML += `
          <th>Assignment</th>
          <th>Due Date</th>
          <th>Status</th>
          <th>AI Grade</th>
          <th>Updated</th>
        </tr></thead><tbody><tr><td colspan="5" style="text-align: center;">Data will be loaded from your database</td></tr>`;
      }
      
      tableHTML += `</tbody></table>`;
      contentDiv.innerHTML = tableHTML;
    }, 800);
  }