import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyA99ANPRPvN_8CkeSyPZL8iO1WR1fA6Fmc",
  authDomain: "gymapp-7e942.firebaseapp.com",
  projectId: "gymapp-7e942",
  storageBucket: "gymapp-7e942.firebasestorage.app",
  messagingSenderId: "147988206224",
  appId: "1:147988206224:web:8f1d5f33f08c1d436d7e15",
  measurementId: "G-45BJ9W3XPR",
  databaseURL: "https://gymapp-7e942-default-rtdb.asia-southeast1.firebasedatabase.app/", // ADD THIS
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

export { app, auth, database };
