import "../global.css";
import { Slot, useSegments, useRouter } from "expo-router";
import React, { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { AuthContextProvider, useAuth } from "@/context/AuthContext";

import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

const MainLayout = () => {
  const { initializing, isAuthenticated } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (initializing) return;

    const timeout = setTimeout(() => {
      const currentSegment = segments[0];

      if (!isAuthenticated && currentSegment !== "(auth)") {
        router.replace("/(auth)/Signup");
      } else if (isAuthenticated && currentSegment === "(auth)") {
        router.replace("/(app)");
      }
    }, 0); // schedule it after render

    return () => clearTimeout(timeout);
  }, [isAuthenticated, initializing, segments]);
  
  
  return (
    <SafeAreaProvider>
      <Slot />
    </SafeAreaProvider>
  );
};

export default function RootLayout() {
  return (
    <AuthContextProvider>
      <>
        <StatusBar style="dark" backgroundColor="#fff" />
        <SafeAreaView className="flex-1">
          <MainLayout />
        </SafeAreaView>
      </>
    </AuthContextProvider>
  );
}
