import { View, Text, Image, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
let renderCount = 0;

const OnboardingScreen = () => {
  const router = useRouter();

  renderCount += 1;
  console.log("onb screen rendered", renderCount, "times");

  return (
    <SafeAreaView className="flex-1 justify-center items-center p-5 bg-gray-50">
      <Image
        source={{ uri: "https://via.placeholder.com/300" }}
        className="w-[300px] h-[300px] mb-5"
        resizeMode="contain"
      />
      <Text className="text-2xl font-bold mb-2.5 text-center">
        Welcome to Our App
      </Text>
      <Text className="text-base text-gray-600 text-center mb-8 px-2.5">
        Discover new features, connect with friends, and enjoy personalized
        experiences.
      </Text>

      <TouchableOpacity
        className="bg-blue-500 py-3 px-8 rounded-lg mb-5"
        onPress={() => router.replace("/(auth)/Signup")}
      >
        <Text className="text-white text-base font-semibold">Get Started</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/(auth)/Login")}>
        <Text className="text-blue-500 text-sm font-medium text-center">
          Already have an account? Log in
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default OnboardingScreen;
