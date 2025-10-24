import { getFirestore, collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";
import { app } from "./FirebaseAuth.js";

// ✅ Initialize Firestore
export const db = getFirestore(app);

/* -----------------------------
   🔹 TEACHERS
----------------------------- */

/**
 * Get teacher info by UID
 * @param {string} uid
 * @returns {Object|null} teacher data or null
 */
export async function getTeacherData(uid) {
  try {
    const teacherRef = doc(db, "teachers", uid);
    const snap = await getDoc(teacherRef);
    return snap.exists() ? snap.data() : null;
  } catch (error) {
    console.error("❌ Error fetching teacher data:", error);
    return null;
  }
}

/* -----------------------------
   🔹 SUBJECTS
----------------------------- */

export async function fetchSubjects() {
  try {
    const snapshot = await getDocs(collection(db, "subjects"));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("❌ Error fetching subjects:", error);
    return [];
  }
}

export async function saveSubject(subjectData) {
  try {
    if (subjectData.id) {
      const subjectRef = doc(db, "subjects", subjectData.id);
      await updateDoc(subjectRef, {
        name: subjectData.name,
        year: subjectData.year,
        lecturer: subjectData.lecturer || "N/A",
      });
      return { success: true, message: "Subject updated successfully" };
    } else {
      await addDoc(collection(db, "subjects"), {
        name: subjectData.name,
        year: subjectData.year,
        lecturer: subjectData.lecturer || "N/A",
      });
      return { success: true, message: "Subject added successfully" };
    }
  } catch (error) {
    console.error("❌ Error saving subject:", error);
    return { success: false, message: "Error saving subject" };
  }
}

export async function deleteSubject(subjectId) {
  try {
    await deleteDoc(doc(db, "subjects", subjectId));
    return { success: true, message: "Subject deleted successfully" };
  } catch (error) {
    console.error("❌ Error deleting subject:", error);
    return { success: false, message: "Error deleting subject" };
  }
}

/* -----------------------------
   🔹 STUDENTS
----------------------------- */

export async function fetchStudentData() {
  try {
    const snapshot = await getDocs(collection(db, "students"));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("❌ Error fetching students:", error);
    return [];
  }
}

export async function saveStudent(studentData) {
  try {
    await addDoc(collection(db, "students"), studentData);
    return { success: true, message: "Student added successfully" };
  } catch (error) {
    console.error("❌ Error saving student:", error);
    return { success: false, message: "Error saving student" };
  }
}
