import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyC9Xr-i9RjQoyEibaf2QBWxrJppAQRTmjQ",
  authDomain: "intro-chat-app-9a8c3.firebaseapp.com",
  projectId: "intro-chat-app-9a8c3",
  storageBucket: "intro-chat-app-9a8c3.appspot.com",
  messagingSenderId: "52446631635",
  appId: "1:52446631635:web:773bb5fda59fc6d40d6626",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
