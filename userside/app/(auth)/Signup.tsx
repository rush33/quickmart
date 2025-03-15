import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  Alert,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import PrimaryButton from "@/components/PrimaryButton";

export default function SignupScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { SignUp } = useAuth();

  const handleSignup = async () => {
    try {
      setLoading(true);
      let res = await SignUp(email, password);
      setLoading(false);
      console.log("res in signup", res);
      if (!res.success) {
        Alert.alert("Sign Up", res.msg);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      className="flex-1 bg-black"
    >
      <StatusBar barStyle="dark-content" />
      {/* Top Image Section */}
      <Image
        source={require("../../assets/images/delivery.jpg")}
        className="absolute w-full h-full"
        resizeMode="cover"
      />

      {/* Content Overlay */}
      <View className="flex-1 justify-end">
        {/* White curved container */}
        <View className="bg-white rounded-t-[40px] px-8 pt-10 pb-14">
          <Text className="text-2xl font-extrabold mb-3">Create Account</Text>
          <Text className="text-lg text-gray-600 mb-8">
            Join us and start your baking adventure
          </Text>

          {error ? (
            <Text className="text-red-500 mb-4 text-center">{error}</Text>
          ) : null}

          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            className="border border-gray-300 rounded-lg p-4 mb-4"
            placeholderTextColor="#666"
          />

          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            className="border border-gray-300 rounded-lg p-4 mb-8"
            placeholderTextColor="#666"
          />

          <PrimaryButton
            title="Sign Up"
            isPrimary={true}
            loading={loading}
            onPressFunction={handleSignup}
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
