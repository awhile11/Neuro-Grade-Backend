// firebaseFirestore.js
import { getFirestore, doc, getDoc, collection, getDocs, updateDoc } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";
import { app } from "./firebaseConfig.js";

const db = getFirestore(app);

// Fetch all students
async function fetchStudents() {
  const studentsCol = collection(db, "students");
  const snapshot = await getDocs(studentsCol);
  const students = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  return students;
}

// Fetch single student grades by ID
async function fetchStudentData(studentId) {
  const docRef = doc(db, "students", studentId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const data = docSnap.data();
    return {
      assignments: data.assignments || Array(11).fill(0),
      tests: data.tests || Array(11).fill(0),
      overallGrade: data.overallGrade || 0
    };
  } else {
    return { assignments: Array(11).fill(0), tests: Array(11).fill(0), overallGrade: 0 };
  }
}

// Update student grades
async function updateStudentGrades(studentId, newGrades) {
  const docRef = doc(db, "students", studentId);
  await updateDoc(docRef, newGrades);
}

export { db, fetchStudents, fetchStudentData, updateStudentGrades };
