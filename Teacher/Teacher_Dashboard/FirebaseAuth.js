import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";
import { app } from "./Firebase-Config.js";

const auth = getAuth(app);

function monitorAuthState(callback = () => {}) {
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      window.location.replace("./LogIn.html");
      return;
    }
    callback(user);
  });
}

async function logoutUser() {
  try {
    await signOut(auth);
    window.location.replace("./LogIn.html");
  } catch (err) {
    console.error("Logout error:", err.message);
  }
}

function getCurrentUser() {
  return auth.currentUser;
}

export { auth, monitorAuthState, logoutUser, getCurrentUser };
