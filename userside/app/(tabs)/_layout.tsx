import { Tabs, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { tintColor } from "@/constants/Colors";
import { useAuth } from "../../context/AuthContext";
import { useEffect } from "react";

export default function TabLayout() {
  const { user } = useAuth();
  const router = useRouter();

  // useEffect(() => {
  //   if (!user) {
  //     router.replace("/(auth)/Onboarding");
  //   }
  // }, [user]);
  // if (!user) return null; // Prevent flashing of protected screens

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: tintColor,
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
