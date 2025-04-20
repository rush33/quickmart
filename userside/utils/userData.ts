import { User } from "@/types/user";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

export const getUserData = async (): Promise<User | null> => {
  const jsonValue = await ReactNativeAsyncStorage.getItem("userData");
  if (jsonValue != null) {
    const userData = JSON.parse(jsonValue);
    console.log("Retrieved user data:", userData);
    return userData;
  } else {
    console.log("No user data found in storage.");
    return null;
  }
};
