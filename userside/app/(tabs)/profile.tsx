import React, { useEffect, useState } from "react";
import { View, Text, SafeAreaView, TouchableOpacity } from "react-native";
import { signOut } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { auth } from "@/utils/firebase";
import { getUserData } from "@/utils/userData";

export default function Profile(): JSX.Element {
  const [name, setName] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const data = await getUserData();
      setName(data?.fname ?? null);
    };
    fetchUser();
  }, []);

  const handleLogout = async (): Promise<void> => {
    await signOut(auth);
    await ReactNativeAsyncStorage.removeItem("userData");
    router.replace("/(auth)/Login"); // Navigate to login or onboarding screen
  };

  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-white">
      <Text className="text-2xl font-bold mb-2">
        Hello, {name ?? "User"} 👋
      </Text>
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
