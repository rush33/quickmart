import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import PrimaryButton from "@/components/PrimaryButton";
import InputBox from "@/components/InputBox";

export default function SignupDetails() {
  const { email, fname, password } = useLocalSearchParams() as {
    email: string;
    fname: string;
    password: string;
  };
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const { SignUp, initializing } = useAuth();
  const router = useRouter();

  const handleFinalSignup = async () => {
    if (!phone || !address) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setLoading(true);
    const res = await SignUp(email, password, fname, phone, address);
    setLoading(false);

    if (!res.success) {
      Alert.alert("Sign Up Failed", res.msg);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      className="flex-1 bg-black"
    >
      <Image
        source={require("../../assets/images/delivery.jpg")}
        className="absolute w-full h-full"
        resizeMode="cover"
      />

      <View className="flex-1 justify-end">
        <View className="bg-white rounded-t-[40px] px-8 pt-10 pb-14">
          <Text className="text-2xl font-extrabold mb-3">More Details</Text>
          <Text className="text-lg text-gray-600 mb-8">
            Just a few more details to complete your signup.
          </Text>

          <InputBox
            placeholder="Phone Number"
            value={phone}
            onChangeText={setPhone}
          />
          <InputBox
            placeholder="Address"
            value={address}
            onChangeText={setAddress}
          />

          <PrimaryButton
            title="Sign Up"
            isPrimary={true}
            loading={loading}
            onPressFunction={handleFinalSignup}
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
