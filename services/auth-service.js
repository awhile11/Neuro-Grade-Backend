import { getAuth, onAuthStateChanged, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";
import {app,auth,db} from "./firebase-init.js";

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
