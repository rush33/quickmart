import { View, Text, Image, TouchableOpacity, Dimensions } from "react-native";
import { useRouter } from "expo-router";
import { OnboardingCopy } from "@/utils/Constants";
import PrimaryButton from "@/components/PrimaryButton";

const OnboardingScreen = () => {
  const router = useRouter();

  const handleSignUp = () => {
    router.replace("/(auth)/Signup");
  };

  const navigateSignIn = () => {
    router.push("/(auth)/Login");
  };

  return (
    <View className="flex-1 bg-black">
      {/* Top Image Section */}
      <Image
        source={require("../../assets/images/onb.png")}
        className="absolute w-full h-full"
        resizeMode="cover"
      />

      {/* Content Overlay */}
      <View className="flex-1 justify-end">
        {/* White curved container */}
        <View className="bg-white rounded-t-[40px] px-8 pt-10 pb-14">
          <Text className="text-2xl font-extrabold mb-3">
            {OnboardingCopy.HEADING}
          </Text>
          <Text className="text-lg text-gray-600 mb-8">
            {OnboardingCopy.SUBHEADING}
          </Text>

          <PrimaryButton
            title="Sign Up"
            isPrimary={true}
            loading={false}
            onPressFunction={handleSignUp}
          />

          <TouchableOpacity onPress={navigateSignIn}>
            <Text className="text-gray-600 text-center">
              Already a member yet? <Text className="text-black">Sign in</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default OnboardingScreen;
