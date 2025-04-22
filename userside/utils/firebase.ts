import { initializeApp } from "firebase/app";
import {
  addDoc,
  getFirestore,
  query,
  QueryConstraint,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { collection, getDocs } from "firebase/firestore";
import { Order } from "@/types/order";
import { router } from "expo-router";

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

export const fetchData = async (collectionName: string) => {
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

export const fetchFilteredData = async (
  collectionName: string,
  filters: QueryConstraint[]
) => {
  try {
    const ref = collection(db, collectionName);
    const q = query(ref, ...filters);
    const querySnapshot = await getDocs(q);

    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return data;
  } catch (error) {
    console.error("Error fetching filtered data:", error);
    throw error;
  }
};

// export const placeOrder = async (
//   order: Omit<Order, "orderId" | "createdAt"> 
// ) => {
//   try {
//     const orderWithTimestamp = {
//       ...order,
//       createdAt: serverTimestamp(),
//     };

//     const docRef = await addDoc(collection(db, "orders"), orderWithTimestamp);

//     await updateDoc(docRef, {
//       orderId: docRef.id,
//     });

//     console.log("✅ Order placed successfully with ID:", docRef.id);
//     router.navigate(`/orders/${docRef.id}`);

//     return {
//       ...orderWithTimestamp,
//       orderId: docRef.id,
//     };
//   } catch (error) {
//     console.error("Error placing order:", error);
//     throw error;
//   }
// };
