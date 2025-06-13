import { initializeApp } from "@firebase/app";
import {
  initializeAuth,
  getReactNativePersistence,
} from "@firebase/auth";
// import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  getFirestore,
  doc,
  query,
  QueryConstraint,
  collection,
  getDocs,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDBrids-pfaLIl6two1mxlHHMHaqDf58Gk",
  authDomain: "quickmart-c5d1c.firebaseapp.com",
  projectId: "quickmart-c5d1c",
  storageBucket: "quickmart-c5d1c.appspot.com", 
  messagingSenderId: "287039088452",
  appId: "1:287039088452:web:20e6753c5d817295bd1911",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
 });

export const db = getFirestore(app);

// Utility to fetch filtered Firestore data
export const fetchFilteredData = async (
  collectionName: string,
  filters: QueryConstraint[]
) => {
  try {
    const ref = collection(db, collectionName);
    const q = query(ref, ...filters);
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error fetching filtered data:", error);
    throw error;
  }
};
