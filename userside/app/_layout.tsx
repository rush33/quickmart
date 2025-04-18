import { Slot, useSegments, useRouter } from "expo-router";
import { AuthContextProvider, useAuth } from "../context/AuthContext";
import { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import { Provider } from "react-redux";
import { store } from "../redux/store";

const MainLayout = () => {
  const { isAuthenticated } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated === undefined) return;

    const currentSegment = segments[0];

    if (!isAuthenticated && currentSegment !== "(auth)") {
      router.replace("/(auth)/Onboarding");
    } else if (isAuthenticated && currentSegment === "(auth)") {
      router.replace("/(tabs)");
    }
  }, [isAuthenticated, segments]);

  return (
    <Provider store={store}>
      <Slot />
    </Provider>
  );
};

export default function RootLayout() {
  return (
    <AuthContextProvider>
      <StatusBar style="dark" />
      <View className="flex-1">
        <MainLayout />
      </View>
    </AuthContextProvider>
  );
}
