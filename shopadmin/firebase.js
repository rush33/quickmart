import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDBrids-pfaLIl6two1mxlHHMHaqDf58Gk",
  authDomain: "quickmart-c5d1c.firebaseapp.com",
  projectId: "quickmart-c5d1c",
  storageBucket: "quickmart-c5d1c.firebasestorage.app",
  messagingSenderId: "287039088452",
  appId: "1:287039088452:web:8b0e9bbe7746c8f6bd1911",
};


export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
