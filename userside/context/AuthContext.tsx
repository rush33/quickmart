import { auth, db } from "@/utils/firebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

interface AuthContextProps {
  user: User | null;
  isAuthenticated: boolean;
  SignUp: (
    email: string,
    password: string,
    fname: string
  ) => Promise<{ success: boolean; msg?: string }>;
  SignIn: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; msg?: string }>;
  SignOut: () => Promise<{ success: boolean; msg?: string }>;
}

const AuthContext = createContext<AuthContextProps | null>(null);

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (currentUser) => {
        console.log("Refresh triggered:", currentUser);
        setUser(currentUser);
        setIsAuthenticated(!!currentUser);
      },
      (error) => {
        console.error("Auth state change error:", error);
      }
    );
    return () => unsubscribe();
  }, []);

  const SignUp = async (email: string, password: string, fname: string) => {
    try {
      const response = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("User created successfully:", response.user.uid);

      await setDoc(doc(db, "users", response.user.uid), {
        email,
        userId: response.user.uid,
        fname,
      });

      console.log("User data saved to Firestore:", {
        email,
        userId: response.user.uid,
        fname,
      });

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
    }
  };

  const SignIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { success: true };
    } catch (error) {
      let msg = error.message;
      if (msg.includes("(auth/invalid-email)")) msg = "Email is invalid";
      if (msg.includes("(auth/invalid-credential)"))
        msg = "Email or Password is incorrect";
      if (msg.includes("(auth/user-not-found)")) msg = "User not found";
      if (msg.includes("(auth/wrong-password)")) msg = "Incorrect password";
      return { success: false, msg };
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

  // const updateUserData = async (userId) => {
  //   const docRef = doc(db, "users", userId);
  //   const docSnap = await getDoc(docRef);

  //   if (docSnap.exists()) {
  //     let data = docSnap.data();
  //     setUser({ ...user, firstName: data.firstName,});
  //   }
  // };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, SignUp, SignIn, SignOut }}
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
