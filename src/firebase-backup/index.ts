import { initializeApp } from 'firebase/app';
import 'firebase/storage';
import firebase from 'firebase/app';
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfigBackup = {
  apiKey: 'AIzaSyDn-kwvvqs4qNL_beRCKd8gIJShkjCMCIE',
  authDomain: 'shop-bac74.firebaseapp.com',
  databaseURL: 'https://shop-bac74-default-rtdb.firebaseio.com',
  projectId: 'shop-bac74',
  storageBucket: 'shop-bac74.appspot.com',
  messagingSenderId: '928275364201',
  appId: '1:928275364201:web:9b808b45587b9049b425f8',
  measurementId: 'G-ZP2QPYLVJ1',
};

// Initialize Firebase
const firebaseconfbackup = initializeApp(firebaseConfigBackup, 'firebaseconfbackup');

// If you want to check whether Firebase is already initialized,
// you can use the `apps` property on the `firebase` namespace directly.

export const storage = getStorage(firebaseconfbackup);
export default firebaseconfbackup;
