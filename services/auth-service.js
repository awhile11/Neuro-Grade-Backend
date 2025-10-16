import { getAuth, onAuthStateChanged, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";
import {app,auth,db,functions} from "./firebase-init.js";

// get current teacher
export async function getCurrentTeacher() {
  return new Promise((resolve, reject) => {
    onAuthStateChanged(auth, async (user) => {
      if (!user) return reject("No user signed in");
      
      const ref = doc(db, "teachers", user.uid);
      const snap = await getDoc(ref);

      if (!snap.exists()) return reject("Not a teacher");

      resolve({ uid: user.uid, ...snap.data() });
    });
  });
}
export async function saveSubject(subjectData) {
  const url = subjectData.id ? `/api/subjects/${subjectData.id}` : '/api/subjects';
  const method = subjectData.id ? 'PUT' : 'POST';

  const response = await fetch(url, {
    method: method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(subjectData),
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  return await response.json();
}

