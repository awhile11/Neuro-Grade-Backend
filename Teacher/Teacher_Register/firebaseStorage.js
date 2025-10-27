// firebaseStorage.js
import { getStorage, ref, uploadBytes, getDownloadURL } 
  from "https://www.gstatic.com/firebasejs/12.2.1/firebase-storage.js";
import { app } from "./firebaseConfig.js";

const storage = getStorage(app);

export { storage, ref, uploadBytes, getDownloadURL };
