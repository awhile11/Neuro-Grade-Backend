import { getStorage, ref, getDownloadURL, uploadBytes } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-storage.js";
import { app } from "./Firebase-Config.js";

const storage = getStorage(app);

export async function getProfileImage(uid) {
  try {
    const imgRef = ref(storage, `profiles/${uid}.jpg`);
    return await getDownloadURL(imgRef);
  } catch (err) {
    console.warn("No profile image found for UID:", uid);
    return null;
  }
}

export async function uploadProfileImage(uid, file) {
  try {
    const imgRef = ref(storage, `profiles/${uid}.jpg`);
    await uploadBytes(imgRef, file);
    return true;
  } catch (err) {
    console.error("Error uploading profile image:", err);
    return false;
  }
}

export { storage };
