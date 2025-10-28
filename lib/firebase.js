import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Firebase configuration - Analytics removed
const firebaseConfig = {
  apiKey: "AIzaSyCyZImg-Uh79qppoJjyr3WIkCqPaE4MFFc",
  authDomain: "turty-2f096.firebaseapp.com",
  projectId: "turty-2f096",
  storageBucket: "turty-2f096.firebasestorage.app",
  messagingSenderId: "292943379883",
  appId: "1:292943379883:web:c9ac1161226993b90b66ee"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);