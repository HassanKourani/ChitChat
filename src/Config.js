// Import the functions you need from the SDKs you need
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAHitfPvf9izaPlBv83RHZV_j8aHoqGhHU",
  authDomain: "socialmedia-app-cb8b1.firebaseapp.com",
  projectId: "socialmedia-app-cb8b1",
  storageBucket: "socialmedia-app-cb8b1.appspot.com",
  messagingSenderId: "865981833613",
  appId: "1:865981833613:web:a9f7b3ca2bf872a643ddc4",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
