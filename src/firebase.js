// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAJf0MOD32VQCPNF40ECoZM9gv0jU8RzmI",
  authDomain: "indyfy-1e811.firebaseapp.com",
  projectId: "indyfy-1e811",
  storageBucket: "indyfy-1e811.firebasestorage.app",
  messagingSenderId: "886986697656",
  appId: "1:886986697656:web:8fb3edb16127c41e433d4d",
  measurementId: "G-J453QG2Q1Z"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
