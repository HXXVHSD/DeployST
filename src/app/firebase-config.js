// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore} from "firebase/firestore"
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBholN04eZ1ZwwcEzp6_kIyyw5nIlcGtWE",
  authDomain: "databaseproject-9ae19.firebaseapp.com",
  projectId: "databaseproject-9ae19",
  storageBucket: "databaseproject-9ae19.firebasestorage.app",
  messagingSenderId: "939920032831",
  appId: "1:939920032831:web:e16e1576746cbda53d648a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);