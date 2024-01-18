import { initializeApp } from 'firebase/app';

// Optionally import the services that you want to use
// import {...} from "firebase/auth";
// import {...} from "firebase/database";
// import {...} from "firebase/firestore";
// import {...} from "firebase/functions";
// import {...} from "firebase/storage";

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
// For more information on how to access Firebase in your project,
// see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase
