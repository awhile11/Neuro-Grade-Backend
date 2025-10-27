// firebaseFunctions.js
import { getFunctions, httpsCallable } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-functions.js";
import { app } from "./firebaseConfig.js";

const functions = getFunctions(app);

// Call a Cloud Function
function callFunction(functionName, data) {
  const func = httpsCallable(functions, functionName);
  return func(data);
}

export { functions, callFunction };
