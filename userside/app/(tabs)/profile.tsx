import React from "react";
import { View, Text, SafeAreaView, Button } from "react-native";
import { useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import { auth } from "@/utils/firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TouchableOpacity } from "react-native";

export default function Profile(): JSX.Element {
  const handleLogout = async (): Promise<void> => {
    await signOut(auth);
    await AsyncStorage.removeItem("userData");
  };

  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-white">
      <Text className="text-2xl font-bold mb-2">Hello, Angana Baruah 👋</Text>
      <Text className="text-base text-gray-500 mb-6">Welcome back!</Text>

      <TouchableOpacity
        className="bg-red-500 px-6 py-3 rounded-lg"
        onPress={handleLogout}
      >
        <Text className="text-white text-base font-medium">Logout</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
