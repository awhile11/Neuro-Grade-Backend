// functions/index.js (Node.js environment)
import * as functions from "firebase-functions";
import axios from "axios";
import { functions } from "./firebaseConfig.js";
import { httpsCallable } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-functions.js";

export const generateTestAI = functions.https.onCall(async (data, context) => {
  const { difficulty, questionCount, questionTypes } = data;

  // Example: call OpenAI or your AI service
  const questions = [];
  for (let i = 1; i <= questionCount; i++) {
    questions.push(`AI question ${i} (${difficulty}): example ${questionTypes.join(', ')}`);
  }

  return { questions };
});

async function generateAITest(difficulty, questionCount, questionTypes) {
  const generateTest = httpsCallable(functions, 'generateTestAI');
  const result = await generateTest({ difficulty, questionCount, questionTypes });
  return result.data.questions;
}
