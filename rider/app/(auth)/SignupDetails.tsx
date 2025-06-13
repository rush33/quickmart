import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  KeyboardAvoidingView,
  Platform,
  Alert,
  StatusBar,
  BackHandler,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import PrimaryButton from "@/components/PrimaryButton";
import InputBox from "@/components/InputBox";
import { useAuth } from "@/context/AuthContext";

export default function SignupDetails() {
  const { email, password } = useLocalSearchParams() as {
    email: string;
    password: string;
  };
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const { SignUp } = useAuth();
  const router = useRouter();

  const handleFinalSignup = async () => {
    if (!phone || !fname || !lname) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    setLoading(true);
    const res = await SignUp(email, password, fname, phone, lname);
    setLoading(false);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      className="flex-1 bg-black"
    >
      <Image
        source={require("../../assets/images/cycle.jpg")}
        className="absolute w-full h-2/3"
        resizeMode="cover"
      />

      <View className="flex-1 justify-end">
        <View className="bg-white rounded-t-[40px] px-8 pt-10 pb-14">
          <Text className="text-2xl font-extrabold mb-3">More Details</Text>
          <Text className="text-base text-gray-600 mb-8">
            Just a few more details to complete your signup.
          </Text>

          <View className="flex">
            <InputBox
              placeholder="First Name"
              value={fname}
              onChangeText={setFname}
            />
            <InputBox
              placeholder="Last Name"
              value={lname}
              onChangeText={setLname}
            />
          </View>

          <InputBox
            placeholder="Phone Number"
            value={phone}
            onChangeText={setPhone}
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
