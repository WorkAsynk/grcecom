// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDAnDaHjcVlpN7QVmrpkKGhXIs_SBV7Jb4",
  authDomain: "grc-logistics.firebaseapp.com",
  projectId: "grc-logistics",
  storageBucket: "grc-logistics.appspot.com",
  messagingSenderId: "49815368025",
  appId: "1:49815368025:web:124e51a2d8f8824af39c48",
  measurementId: "G-XJDKTN5HPK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);