// firebaseFunctions.js
import { httpsCallable, getFunctions } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-functions.js";
import { app } from "./firebaseConfig.js";

const functions = getFunctions(app);

// 🔹 Example: Auto-grade test after submission
async function autoGradeTest(submissionData) {
  try {
    const gradeTest = httpsCallable(functions, "autoGradeTest");
    const result = await gradeTest(submissionData);
    console.log("✅ Auto-grading result:", result.data);
    return result.data;
  } catch (err) {
    console.error("❌ Auto-grading failed:", err);
  }
}

export { functions, autoGradeTest };
