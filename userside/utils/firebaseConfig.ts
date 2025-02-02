import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyDBrids-pfaLIl6two1mxlHHMHaqDf58Gk",
  authDomain: "quickmart-c5d1c.firebaseapp.com",
  projectId: "quickmart-c5d1c",
  storageBucket: "quickmart-c5d1c.firebasestorage.app",
  messagingSenderId: "287039088452",
  appId: "1:287039088452:web:41975753ef9364ebbd1911",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

export const db = getFirestore(app);