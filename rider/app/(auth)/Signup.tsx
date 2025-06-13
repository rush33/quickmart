import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Platform,
  ScrollView,
  TextInput,
  StatusBar,
  KeyboardAvoidingView,
} from "react-native";
import { useRouter } from "expo-router";
import PrimaryButton from "@/components/PrimaryButton";
import InputBox from "@/components/InputBox";

export default function SignupScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const goToNextStep = () => {
    setLoading(true);
    if (!email || !password) {
      setError("Please fill in all fields.");
      setLoading(false);
      return;
    }

    router.navigate({
      pathname: "/(auth)/SignupDetails",
      params: { email, password },
    });
    setLoading(false);
  };

  return (
    <View className="flex-1 bg-black">
      <Image
        source={require("../../assets/images/cycle.jpg")}
        className="absolute w-full h-2/3"
        resizeMode="cover"
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: "flex-end" }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="bg-white rounded-t-[40px] px-8 pt-10 pb-14">
            <Text className="text-2xl font-extrabold mb-3">Create Rider Account</Text>
            <Text className="text-base text-gray-600 mb-8">
              Deliver orders quickly and reliably—be the hero behind every
              doorstep!
            </Text>

            {error ? (
              <Text className="text-red-500 mb-4 text-center">{error}</Text>
            ) : null}

            <InputBox
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
            />
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
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
