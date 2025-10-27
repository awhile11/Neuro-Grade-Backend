// firebaseStorage.js
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-storage.js";
import { app } from "./firebaseConfig.js";

const storage = getStorage(app);

// Upload file
async function uploadFile(path, file) {
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  const url = await getDownloadURL(storageRef);
  return url;
}

// Get file URL
async function getFileURL(path) {
  const storageRef = ref(storage, path);
  const url = await getDownloadURL(storageRef);
  return url;
}

export { storage, uploadFile, getFileURL };
