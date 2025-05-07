import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { useRouter } from "expo-router";
import { getUserData } from "@/utils/userData";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import PrimaryButton from "@/components/PrimaryButton";
import { useAuth } from "@/context/AuthContext";

export default function Profile(): JSX.Element {
  const [name, setName] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();
  const { SignOut } = useAuth();

  useEffect(() => {
    const fetchUser = async () => {
      const data = await getUserData();
      setName(data?.fname ?? null);
      setEmail(data?.email ?? null);
      setPhoneNumber(data?.phoneNumber ?? null);
    };
    fetchUser();
  }, []);

  const handleLogout = async (): Promise<void> => {
    setIsLoggingOut(true);
    try {
      await SignOut();
      router.replace("/(auth)/Login");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="px-4 py-6 flex-1">
        {/* Profile Info */}
        <View className="my-4">
          <Text className="text-2xl font-bold mb-2">
            {name ? `Hello, ${name} 👋🏻` : "Hello, User"}
          </Text>
          <Text className="text-gray-600 mb-1">
            {phoneNumber ? `+91 - ${phoneNumber}` : ""} ·{" "}
            {email ?? "example@gmail.com"}
          </Text>
        </View>

        {/* Divider */}
        <View className="h-[1px] bg-gray-200 my-4" />

        {/* My Account Section */}
        <TouchableOpacity
          onPress={() => router.push("/editProfile")}
          className="flex-row justify-between items-center py-4"
        >
          <View>
            <Text className="text-xl font-semibold mb-1">Edit Profile</Text>
            <Text className="text-gray-500">Change or Update Your Details</Text>
          </View>
          <AntDesign name="right" size={20} color="gray" />
        </TouchableOpacity>

        {/* Divider */}
        <View className="h-[1px] bg-gray-200 my-4" />

        {/* Addresses Section */}
        {/* <TouchableOpacity className="flex-row justify-between items-center py-4">
          <View>
            <Text className="text-xl font-semibold mb-1">Addresses</Text>
            <Text className="text-gray-500">
              Share, Edit & Add New Addresses
            </Text>
          </View>
          <AntDesign name="right" size={20} color="gray" />
        </TouchableOpacity> */}

        {/* Divider */}
        {/* <View className="h-[1px] bg-gray-200 my-4" /> */}

        {/* Spacer */}
        <View className="flex-1" />

        {/* Logout Button */}
        <View className="mt-4">
          <PrimaryButton
            title="Logout"
            loading={isLoggingOut}
            isPrimary={false}
            onPressFunction={handleLogout}
            style={{ backgroundColor: "#FA8072" }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
