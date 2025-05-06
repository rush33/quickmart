import { Slot, useSegments, useRouter } from "expo-router";
import { AuthContextProvider, useAuth } from "../context/AuthContext";
import { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { Provider } from "react-redux";
import { store } from "../redux/store";
import { SafeAreaView } from "react-native-safe-area-context";
import { ActivityIndicator, View } from "react-native";

const MainLayout = () => {
  const { initializing, isAuthenticated } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (initializing) return;

    const currentSegment = segments[0];

    if (!isAuthenticated && currentSegment !== "(auth)") {
      router.replace("/(auth)/Onboarding");
    } else if (isAuthenticated && currentSegment === "(auth)") {
      router.replace("/(tabs)");
    }
  }, [isAuthenticated, initializing, segments]);

  // if (initializing) {
  //   return (
  //     <View className="flex-1 justify-center items-center bg-white">
  //       <ActivityIndicator size="large" color="#000" />
  //     </View>
  //   );
  // }

  return (
    <Provider store={store}>
      <Slot />
    </Provider>
  );
};

export default function RootLayout() {
  return (
    <AuthContextProvider>
      <StatusBar style="dark" backgroundColor="#fff" />
      <SafeAreaView className="flex-1">
        <MainLayout />
      </SafeAreaView>
    </AuthContextProvider>
  );
}
