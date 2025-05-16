// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase, Database } from "firebase/database";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCGEOx_7T-YqxyjJDQpqEFUCELkpQPg9Iw",
  authDomain: "nutrimate-database.firebaseapp.com",
  databaseURL: "https://nutrimate-database-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "nutrimate-database",
  storageBucket: "nutrimate-database.firebasestorage.app",
  messagingSenderId: "101978859809",
  appId: "1:101978859809:web:b2140c5d59f6eb0fbf7660",
  measurementId: "G-0VVBWJX0XK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);


// Get Realtime Database instance
export const database = getDatabase(app);