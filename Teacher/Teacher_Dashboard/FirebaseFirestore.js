import { getFirestore, doc, getDoc, collection, getDocs, addDoc, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";
import { app } from "./Firebase-Config.js";

const db = getFirestore(app);

// TEACHERS
export async function getTeacherData(uid) {
  try {
    const snap = await getDoc(doc(db, "teachers", uid));
    return snap.exists() ? snap.data() : null;
  } catch (err) {
    console.error("Error fetching teacher data:", err);
    return null;
  }
}

// STUDENTS
export async function fetchStudentData() {
  try {
    const snapshot = await getDocs(collection(db, "students"));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (err) {
    console.error("Error fetching students:", err);
    return [];
  }
}

// SUBJECTS
export async function fetchSubjects() {
  try {
    const snapshot = await getDocs(collection(db, "subjects"));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (err) {
    console.error("Error fetching subjects:", err);
    return [];
  }
}

export async function saveSubject(subjectData) {
  try {
    if (subjectData.id) {
      await updateDoc(doc(db, "subjects", subjectData.id), subjectData);
      return { success: true };
    } else {
      await addDoc(collection(db, "subjects"), subjectData);
      return { success: true };
    }
  } catch (err) {
    console.error("Error saving subject:", err);
    return { success: false };
  }
}

export async function deleteSubject(subjectId) {
  try {
    await deleteDoc(doc(db, "subjects", subjectId));
    return { success: true };
  } catch (err) {
    console.error("Error deleting subject:", err);
    return { success: false };
  }
}

export { db };
