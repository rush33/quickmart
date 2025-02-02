import { View, Text, SafeAreaView, StatusBar, Button } from "react-native";
import { useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import { auth } from "@/utils/firebaseConfig";

export default function Profile() {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/(auth)/Onboarding");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <StatusBar barStyle="dark-content" />
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ fontSize: 20, fontWeight: "600" }}>Profile Screen</Text>
        <Button title="Logout" onPress={handleLogout} />
      </View>
    </SafeAreaView>
  );
}
