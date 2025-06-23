import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from "react-native";
import { useRouter } from "expo-router";
import PrimaryButton from "@/components/PrimaryButton";
import InputBox from "@/components/InputBox";

export default function SignupScreen() {
  const [email, setEmail] = useState("");
  const [fname, setFname] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const goToNextStep = () => {
    setLoading(true);

    // Basic email regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || !fname || !password) {
      setError("Please fill in all fields.");
      setLoading(false);
      return;
    }

    if (fname.trim().length < 3) {
      setError("First name should be at least 3 characters.");
      setLoading(false);
      return;
    }

    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password should be at least 6 characters long.");
      setLoading(false);
      return;
    }

    // All validations passed
    setError(""); // Clear any previous errors
    router.navigate({
      pathname: "/(auth)/SignupDetails",
      params: { email, fname, password },
    });
    setLoading(false);
  };
  

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      className="flex-1 bg-black"
    >
      <StatusBar barStyle="dark-content" />
      <Image
        source={require("../../assets/images/delivery.jpg")}
        className="absolute w-full h-full"
        resizeMode="cover"
      />

      <View className="flex-1 justify-end">
        <View className="bg-white rounded-t-[40px] px-8 pt-10 pb-14">
          <Text className="text-2xl font-extrabold mb-3">Create Account</Text>
          <Text className="text-lg text-gray-600 mb-8">
            Get fresh groceries delivered to your doorstep, anytime!
          </Text>

          {error ? (
            <Text className="text-red-500 mb-4 text-center">{error}</Text>
          ) : null}

          <InputBox
            placeholder="First Name"
            value={fname}
            onChangeText={setFname}
          />
          <InputBox placeholder="Email" value={email} onChangeText={setEmail} />
          <InputBox
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <PrimaryButton
            title="Next"
            isPrimary={true}
            onPressFunction={goToNextStep}
            loading={loading}
          />

          <TouchableOpacity onPress={() => router.push("/(auth)/Login")}>
            <Text className="text-gray-600 text-center mt-4">
              Already have an account?{" "}
              <Text className="text-black">Sign in</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
