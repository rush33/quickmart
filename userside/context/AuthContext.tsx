import { store } from "@/redux/store";
import { User } from "@/types/user";
import { auth, db, fetchFilteredData, updateData } from "@/utils/firebase";
import {
  getUserData,
  logLocalUserData,
  updateUserDataField,
} from "@/utils/userData";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from "firebase/auth";
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
    phone: string,
    address: string
  ) => Promise<{ success: boolean; msg?: string }>;
  SignIn: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; msg?: string }>;
  SignOut: () => Promise<{ success: boolean; msg?: string }>;
  updateUserData: (
    updatedFields: Record<string, any>
  ) => Promise<{ success: boolean; msg?: string }>;
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
    phone: string,
    address: string
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
        userId: response.user.uid,
        fname: fname,
        phoneNumber: phone,
        address: address,
      };

      await setDoc(doc(db, "users", response.user.uid), userData);
      console.log("user data set");

      await ReactNativeAsyncStorage.setItem(
        "userData",
        JSON.stringify(userData)
      );
      console.log("✅ AsyncStorage: User data saved on SignUp");

      await logLocalUserData();

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
      const userRef = doc(db, "users", res.user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        await ReactNativeAsyncStorage.setItem(
          "userData",
          JSON.stringify(userData)
        );
        console.log("✅ AsyncStorage: User data saved on SignIn");
        await logLocalUserData();
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
      await ReactNativeAsyncStorage.clear();
      store.dispatch({ type: "RESET_APP" });
      return { success: true };
    } catch (error) {
      console.error("Logout error:", error);
      return { success: false, msg: "Failed to log out" };
    }
  };

  const updateUserData = async (
    updatedFields: Record<string, any>
  ): Promise<{ success: boolean; msg?: string }> => {
    if (!user) {
      return { success: false, msg: "No authenticated user" };
    }

    try {
      await updateData("users", user.uid, updatedFields);

      // await ReactNativeAsyncStorage.clear();
      await logLocalUserData();
      const [updatedUserData] = await fetchFilteredData("users", [
        where("userId", "==", user.uid),
      ]);

      console.log("updated data from db", updatedUserData);
      updateUserDataField({
        address: updatedUserData.address,
        fname: updatedUserData.fname,
        lastName: updatedUserData.lastName,
        phoneNumber: updatedUserData.phoneNumber,
      });
      
      console.log("✅ AsyncStorage: User data updated");
      await logLocalUserData();

      return { success: true };
    } catch (error: any) {
      console.error("Error updating user data:", error);
      return { success: false, msg: "Failed to update user data" };
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
        updateUserData,
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
