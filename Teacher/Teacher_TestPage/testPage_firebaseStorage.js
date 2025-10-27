// firebaseStorage.js
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-storage.js";
import { app } from "./firebaseConfig.js";

const storage = getStorage(app);

// 🔹 Upload a file (e.g., essay attachments or images)
async function uploadFile(file, path) {
  const fileRef = ref(storage, path);
  try {
    const snapshot = await uploadBytes(fileRef, file);
    console.log("✅ File uploaded:", snapshot.metadata.fullPath);
    return await getDownloadURL(fileRef);
  } catch (err) {
    console.error("❌ File upload failed:", err);
  }
}

export { storage, uploadFile };
