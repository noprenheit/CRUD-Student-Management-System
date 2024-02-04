import { initializeApp } from 'firebase/app';
import { getFirestore } from "firebase/firestore";


// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCF1MvC1SOYaWxgjwuSTu120ciDab66qGk",
    authDomain: "ikt205assignment1-2353c.firebaseapp.com",
    projectId: "ikt205assignment1-2353c",
    storageBucket: "ikt205assignment1-2353c.appspot.com",
    messagingSenderId: "307390609536",
    appId: "1:307390609536:web:c7b21bd2ce13e220438e65",
    measurementId: "G-FZE9F85BNP"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_DB = getFirestore(FIREBASE_APP)
