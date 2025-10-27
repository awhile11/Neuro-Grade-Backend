// firebaseFirestore.js
import { getFirestore, doc, setDoc, getDoc, serverTimestamp } 
  from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";
import { app } from "./firebaseConfig.js";

const db = getFirestore(app);

/**
 * Save new teacher to Firestore
 */
async function saveTeacherData(uid, data) {
  await setDoc(doc(db, "teachers", uid), {
    ...data,
    createdAt: serverTimestamp()
  });
}

/**
 * Get teacher data from Firestore
 */
async function getTeacherData(uid) {
  const ref = doc(db, "teachers", uid);
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() : null;
}

export { db, saveTeacherData, getTeacherData };
