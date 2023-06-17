import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCLZZoyaAV-YTQ7qUtg1aNZ4tbLjAPNxT0",
  authDomain: "connekt-74bb7.firebaseapp.com",
  projectId: "connekt-74bb7",
  storageBucket: "connekt-74bb7.appspot.com",
  messagingSenderId: "283250294458",
  appId: "1:283250294458:web:e71b37b6c265c4d90c0c83",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db, onAuthStateChanged };
