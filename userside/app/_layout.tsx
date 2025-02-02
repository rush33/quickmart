import { Slot, useSegments, useRouter } from "expo-router";
import { AuthContextProvider, useAuth } from "../context/AuthContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect } from "react";

const MainLayout = () => {
  const { isAuthenticated } = useAuth();
  const segments = useSegments();
  const router = useRouter(); // Use inside component

  useEffect(() => {
    if (isAuthenticated === undefined) return; // Avoid running until determined

    const isInAppSegment = segments[0] === "(tabs)";

    if (isAuthenticated && !isInAppSegment) {
      router.replace("/(tabs)"); // Redirect authenticated users
    } else if (!isAuthenticated && segments[0] !== "(auth)") {
      router.replace("/(auth)/Onboarding"); // Redirect non-authenticated users
    }
  }, [isAuthenticated, segments, router]);

  return <Slot />;
};

export default function RootLayout() {
  return (
    <AuthContextProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <MainLayout />
      </SafeAreaView>
    </AuthContextProvider>
  );
}
