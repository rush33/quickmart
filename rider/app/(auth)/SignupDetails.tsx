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
    if (!fname.trim() || !lname.trim() || !phone.trim()) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (fname.trim().length < 2) {
      Alert.alert(
        "Invalid First Name",
        "First name must be at least 2 characters."
      );
      return;
    }

    if (lname.trim().length < 2) {
      Alert.alert(
        "Invalid Last Name",
        "Last name must be at least 2 characters."
      );
      return;
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone.trim())) {
      Alert.alert(
        "Invalid Phone Number",
        "Phone number must be exactly 10 digits."
      );
      return;
    }

    setLoading(true);
    const res = await SignUp(
      email,
      password,
      fname.trim(),
      lname.trim(),
      phone.trim()
    );
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
            keyboardType="number-pad"
            maxLength={10}
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
