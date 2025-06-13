import { auth, db } from "@/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from "@firebase/auth";
import { doc, getDoc, setDoc, where } from "firebase/firestore";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

interface AuthContextProps {
  user: FirebaseUser | null;
  isAuthenticated: boolean;
  initializing: boolean;
  SignUp: (
    email: string,
    password: string,
    fname: string,
    lname: string,
    phone: string,
  ) => Promise<{ success: boolean; msg?: string }>;
  SignIn: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; msg?: string }>;
  SignOut: () => Promise<{ success: boolean; msg?: string }>;
}

const AuthContext = createContext<AuthContextProps | null>(null);

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [initializing, setInitializing] = useState(false);

  useEffect(() => {
    console.warn("✅ AuthContext mounted");
    const unsubscribe = onAuthStateChanged(
      auth,
      (currentUser) => {
        setUser(currentUser);
        setIsAuthenticated(!!currentUser);
      },
      (error) => {
        console.error("Auth state change error:", error);
      }
    );
    return () => unsubscribe();
  }, []);

  const SignUp = async (
    email: string,
    password: string,
    fname: string,
    lname: string,
    phone: string
  ) => {
    try {
      setInitializing(true);

      const response = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const userData = {
        email: email,
        riderId: response.user.uid,
        fname: fname,
        lname: lname,
        phoneNumber: phone,
      };

      await setDoc(doc(db, "riders", response.user.uid), userData);
      console.log("user data set");
      return { success: true };
    } catch (error: any) {
      console.error("Error during SignUp:", error);

      let msg = error.message;
      if (msg.includes("(auth/invalid-email)")) msg = "Email is invalid";
      if (msg.includes("(auth/email-already-in-use)"))
        msg = "This email is already in use";
      if (msg.includes("(auth/weak-password)"))
        msg = "Password must be at least 6 characters";

      return { success: false, msg };
    } finally {
      setInitializing(false);
    }
  };

  const SignIn = async (email: string, password: string) => {
    try {
      setInitializing(true);
      const res = await signInWithEmailAndPassword(auth, email, password);
      const userRef = doc(db, "riders", res.user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        console.log("✅ Firestore: User data loaded on SignIn", userData);
      }

      return { success: true };
    } catch (error: any) {
      let msg = error.message;
      if (msg.includes("(auth/invalid-email)")) msg = "Email is invalid";
      if (msg.includes("(auth/invalid-credential)"))
        msg = "Email or Password is incorrect";
      if (msg.includes("(auth/user-not-found)")) msg = "User not found";
      if (msg.includes("(auth/wrong-password)")) msg = "Incorrect password";
      return { success: false, msg };
    } finally {
      setInitializing(false);
    }
  };

  const SignOut = async () => {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error) {
      console.error("Logout error:", error);
      return { success: false, msg: "Failed to log out" };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        SignUp,
        SignIn,
        SignOut,
        initializing,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthContextProvider");
  }
  return context;
};
