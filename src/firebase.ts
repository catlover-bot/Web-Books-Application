// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBKKlN7nq9oqfDlTV4WdqaD23ou7LOX1Bw",
  authDomain: "bookshelf-app-9a295.firebaseapp.com",
  projectId: "bookshelf-app-9a295",
  storageBucket: "bookshelf-app-9a295.firebasestorage.app",
  messagingSenderId: "604328615143",
  appId: "1:604328615143:web:9a9f0bb01bdebb81a75642"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };