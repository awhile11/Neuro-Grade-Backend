import { db } from "./firebaseConfig.js";
import { collection, addDoc, setDoc, doc, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

// Save test
async function saveTest(testName, testDescription, questions) {
  try {
    const testRef = await addDoc(collection(db, "tests"), {
      name: testName,
      description: testDescription,
      createdAt: serverTimestamp()
    });

    // Save questions inside a subcollection
    const questionsRef = collection(db, "tests", testRef.id, "questions");
    for (let i = 0; i < questions.length; i++) {
      await addDoc(questionsRef, {
        content: questions[i],
        order: i + 1
      });
    }

    alert('Test saved successfully in Firestore!');
  } catch (error) {
    console.error("Error saving test:", error);
    alert('Failed to save test');
  }
}

// Example usage (hooked into your "Save Test" button)
document.getElementById('save-test-btn').addEventListener('click', async function() {
  const testName = document.getElementById('test-name').value;
  const testDescription = document.getElementById('test-description').value;
  const questions = Array.from(document.querySelectorAll('.question-item textarea')).map(t => t.value);

  if (!testName || questions.length === 0) {
    alert('Please enter test name and questions');
    return;
  }

  await saveTest(testName, testDescription, questions);
});
