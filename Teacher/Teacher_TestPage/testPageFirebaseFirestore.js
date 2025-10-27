// firebaseFirestore.js
import { getFirestore, collection, getDocs, doc, getDoc, setDoc, addDoc } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";
import { app } from "./firebaseConfig.js";

const db = getFirestore(app);

// 🔹 Fetch student test data (replace mock data later)
async function fetchTestData(testId) {
  try {
    const testRef = doc(db, "tests", testId);
    const testSnap = await getDoc(testRef);
    if (testSnap.exists()) {
      return testSnap.data();
    } else {
      console.warn("⚠️ No such test found in Firestore!");
      return null;
    }
  } catch (err) {
    console.error("❌ Error fetching test data:", err);
  }
}

// 🔹 Submit answers
async function submitTestAnswers(studentId, testId, answers) {
  try {
    await setDoc(doc(db, "submissions", `${studentId}_${testId}`), {
      studentId,
      testId,
      answers,
      submittedAt: new Date().toISOString()
    });
    console.log("✅ Answers submitted successfully to Firestore");
  } catch (err) {
    console.error("❌ Error saving answers:", err);
  }
}

export { db, fetchTestData, submitTestAnswers };
