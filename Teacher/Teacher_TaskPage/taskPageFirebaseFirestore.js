// firebaseFirestore.js
import { getFirestore, doc, getDoc, setDoc, collection, getDocs } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";
import { app } from "./firebaseConfig.js";

// Initialize Firestore
export const db = getFirestore(app);

// Example: Get teacher data
export async function getTeacherData(uid) {
  const ref = doc(db, "teachers", uid);
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() : null;
}

// Example: Get all students
export async function fetchStudents() {
  const querySnapshot = await getDocs(collection(db, "students"));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// Example: Save course data
export async function saveCourse(courseId, data) {
  await setDoc(doc(db, "courses", courseId), data);
  console.log("📘 Course saved:", data);
}
