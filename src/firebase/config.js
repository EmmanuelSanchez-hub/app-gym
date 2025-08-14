// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAztghawEylDpVU0UnE2m6bxrmgxGfwh8Y",
  authDomain: "app-gym-cd550.firebaseapp.com",
  databaseURL: "https://app-gym-cd550-default-rtdb.firebaseio.com",
  projectId: "app-gym-cd550",
  storageBucket: "app-gym-cd550.firebasestorage.app",
  messagingSenderId: "494880074589",
  appId: "1:494880074589:web:1b1376f23adc3c2ded16b4",
  measurementId: "G-1Q669SKRC4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getDatabase(app);
const analytics = getAnalytics(app);

export { auth, db, analytics };