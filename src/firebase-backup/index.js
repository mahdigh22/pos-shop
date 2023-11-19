import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfigBackup = {
  apiKey: "AIzaSyDn-kwvvqs4qNL_beRCKd8gIJShkjCMCIE",
  authDomain: "shop-bac74.firebaseapp.com",
  databaseURL: "https://shop-bac74-default-rtdb.firebaseio.com",
  projectId: "shop-bac74",
  storageBucket: "shop-bac74.appspot.com",
  messagingSenderId: "928275364201",
  appId: "1:928275364201:web:9b808b45587b9049b425f8",
  measurementId: "G-ZP2QPYLVJ1",
};

// Initialize Firebase
const firebaseconfbackup = initializeApp(firebaseConfigBackup,'firebaseconfbackup');

export default firebaseconfbackup;
