// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore} from "firebase/firestore"
import { getAuth } from 'firebase/auth';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD7rIF6QxS6g7LSHMQZm9QJPn3C1Eu3DTU",
  authDomain: "swaptrade-database.firebaseapp.com",
  projectId: "swaptrade-database",
  storageBucket: "swaptrade-database.firebasestorage.app",
  messagingSenderId: "149234096731",
  appId: "1:149234096731:web:81e6fe3912626e4e41fd7e",
  measurementId: "G-0ZN8JC5ZG2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
