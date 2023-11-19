import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAg7JyZ7GK7E5usW8BTvLUI7zOQNb27dJ8",
  authDomain: "car-shop-cb0a5.firebaseapp.com",
  databaseURL: "https://car-shop-cb0a5-default-rtdb.firebaseio.com",
  projectId: "car-shop-cb0a5",
  storageBucket: "car-shop-cb0a5.appspot.com",
  messagingSenderId: "281706051090",
  appId: "1:281706051090:web:a050a5f6875a73d295cacb",
  measurementId: "G-33KGKP5RVT"
};

// Initialize Firebase
const firebaseconf= initializeApp(firebaseConfig);




export default firebaseconf;