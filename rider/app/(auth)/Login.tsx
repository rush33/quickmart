import { useState } from "react";
import {
  View,
  Text,
  Alert,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import React from "react";
import PrimaryButton from "@/components/PrimaryButton";
import InputBox from "@/components/InputBox";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { SignIn } = useAuth();

  const handleSignIn = async () => {
    try {
      setLoading(true);
      const res = await SignIn(email, password);
      if (!res.success) {
        Alert.alert("Log Up Failed", res.msg);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      className="flex-1"
    >
      <Image
        source={require("../../assets/images/cycle.jpg")}
        className="absolute w-full h-2/3"
        resizeMode="cover"
      />

      <View className="flex-1 justify-end">
        <View className="bg-white rounded-t-[40px] px-8 pt-10 pb-10">
          <Text className="text-2xl font-extrabold mb-3">Welcome Back!</Text>
          <Text className="text-base text-gray-600 mb-8">
            Sign in to start your grocery delivery adventure
          </Text>

          {error ? (
            <Text className="text-red-500 mb-4 text-center">{error}</Text>
          ) : null}
          <InputBox placeholder="Email" value={email} onChangeText={setEmail} />
          <InputBox
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <PrimaryButton
            title="Sign In"
            isPrimary={true}
            loading={loading}
            onPressFunction={handleSignIn}
          />
          <TouchableOpacity onPress={() => router.push("/(auth)/Signup")}>
            <Text className="text-gray-600 text-center mt-4">
              Don't have an account? <Text className="text-black">Sign up</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
