import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import PrimaryButton from "@/components/PrimaryButton";
import { router } from "expo-router";
import InputBox from "@/components/InputBox";

export default function EditProfile(): JSX.Element {
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [phoneNumberError, setPhoneNumberError] = useState<string>("");

  const handlePhoneNumberChange = (text: string) => {
    const formattedPhoneNumber = text.replace(/\D/g, "").slice(0, 10);
    setPhoneNumber(formattedPhoneNumber);

    if (formattedPhoneNumber.length !== 10) {
      setPhoneNumberError("Phone number must be 10 digits.");
    } else {
      setPhoneNumberError("");
    }
  };

  return (
    <SafeAreaView className="bg-white flex-1">
      <View className="p-5 bg-white shadow-xs mb-5">
        <TouchableOpacity
          className="absolute top-4 left-4 bg-white p-2 rounded-full"
          onPress={() => {
            router.navigate("/(tabs)/profile");
          }}
        >
          <Ionicons name="arrow-back-outline" size={22} color="#00000" />
        </TouchableOpacity>
        <View>
          <Text className="text-xl font-bold text-center">
            Update your details
          </Text>
        </View>
      </View>

      <KeyboardAvoidingView
        className="flex-1 px-5 bg-white"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <View className="mb-4">
            <Text className="text-lg font-bold mb-2 text-black">
              First Name
            </Text>
            <InputBox
              placeholder="Enter your first name"
              value={firstName}
              onChangeText={setFirstName}
            />
          </View>

          <View className="mb-4">
            <Text className="text-lg font-bold mb-2 text-black">Last Name</Text>
            <InputBox
              placeholder="Enter your last name"
              value={lastName}
              onChangeText={setLastName}
            />
          </View>

          <View className="mb-4">
            <Text className="text-lg font-bold mb-2 text-black">
              Phone Number
            </Text>
            <InputBox
              placeholder="Enter your phone number"
              value={phoneNumber}
              onChangeText={handlePhoneNumberChange}
              keyboardType="phone-pad"
            />
            {phoneNumberError ? (
              <Text style={{ color: "red" }}>{phoneNumberError}</Text>
            ) : null}
          </View>

          <View className="mb-4">
            <Text className="text-lg font-bold mb-2 text-black">
              Street Address
            </Text>
            <InputBox
              placeholder="Enter your address"
              value={address}
              onChangeText={setAddress}
            />
          </View>

          {/* Placeholder for map */}
          <View className="mt-4 mb-6 h-40 rounded-2xl overflow-hidden border border-gray-300 items-center justify-center bg-gray-100">
            <Text className="text-gray-500">Map placeholder</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <View className="p-5">
        <PrimaryButton
          isPrimary={true}
          onPressFunction={() => {}}
          loading={false}
          title="Update"
        />
      </View>
    </SafeAreaView>
  );
}
