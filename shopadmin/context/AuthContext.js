"use client";
import { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "@/firebase";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Track auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Signup
  const signup = async (
    email,
    password,
    shopName,
    address,
    imageUrl,
    items,
    lat,
    long
  ) => {
    try {
      const response = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const shopAdminData = {
        email: email,
        shopAdminId: response.user.uid,
        name: shopName,
        address: address,
        image: imageUrl,
        genre: items,
        lat: lat,
        long: long,
      };

      await setDoc(doc(db, "shops", response.user.uid), shopAdminData);
      console.log("shop data set");

      localStorage.setItem("shopAdminId", response.user.uid);
      return { success: true };
    } catch (error) {
      console.error("Error during signup:", error);

      let msg = error.message;
      if (msg.includes("(auth/invalid-email)")) msg = "Email is invalid";
      if (msg.includes("(auth/email-already-in-use)"))
        msg = "This email is already in use";
      if (msg.includes("(auth/weak-password)"))
        msg = "Password must be at least 6 characters";

      return { success: false, msg };
    }
  };

  // Login
  const login = async (email, password) => {
    try {
      const res = await signInWithEmailAndPassword(auth, email, password);

      const shopAdminRef = doc(db, "shops", res.user.uid);
      const shopAdminSnap = await getDoc(shopAdminRef);

      if (shopAdminSnap.exists()) {
        console.log("ShopAdmin data:", shopAdminSnap.data());
        localStorage.setItem("shopAdminId", res.user.uid);
        return { success: true };
      } else {
        console.log("No shopAdmin data found!");
        return {
          success: false,
          msg: "No shop admin data found for this user",
        };
      }
    } catch (error) {
      console.error("Login Error:", error); 

      let msg = error.message.toLowerCase();

      if (msg.includes("auth/invalid-email")) msg = "Email is invalid";
      else if (msg.includes("auth/invalid-credential"))
        msg = "Email or Password is incorrect";
      else if (msg.includes("auth/user-not-found")) msg = "User not found";
      else if (msg.includes("auth/wrong-password")) msg = "Incorrect password";
      else msg = "Login failed. Please try again.";

      return { success: false, msg };
    }
  };

  // Logout
  const logout = async () => {
    await signOut(auth);
    localStorage.removeItem("shopAdminId");
  };

  const value = {
    user,
    loading,
    signup,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
