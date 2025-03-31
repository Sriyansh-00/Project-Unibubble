// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA15Elm0trfdo6U5tg_sRfJmGVIiSGyoJ8",
  authDomain: "unibubble-c84a8.firebaseapp.com",
  projectId: "unibubble-c84a8",
  storageBucket: "unibubble-c84a8.firebasestorage.app",
  messagingSenderId: "421198476528",
  appId: "1:421198476528:web:4607b138df4c34fe54fe35",
  measurementId: "G-2VSBKPRWQW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);