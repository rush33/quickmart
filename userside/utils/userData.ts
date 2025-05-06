import { User } from "@/types/user";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

export const getUserData = async (): Promise<User | null> => {
  console.log("get userData called");
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

export const logLocalUserData = async () => {
  try {
    const stored = await ReactNativeAsyncStorage.getItem("userData");
    console.log("✅ LocalDB: Stored userData:", stored);
  } catch (error) {
    console.error("❌ Error reading from AsyncStorage:", error);
  }
};

export const updateUserDataField = async (newField: object) => {
  try {
    const jsonValue = await ReactNativeAsyncStorage.getItem("userData");

    if (!jsonValue) {
      console.warn("No user data found in AsyncStorage");
      return;
    }

    const userData = JSON.parse(jsonValue);

    const updatedUserData = { ...userData, ...newField };

    await ReactNativeAsyncStorage.setItem(
      "userData",
      JSON.stringify(updatedUserData)
    );

    console.log("✅ Updated userData in AsyncStorage:", updatedUserData);
    logLocalUserData();
  } catch (e) {
    console.error("Error updating userData:", e);
  }
};
