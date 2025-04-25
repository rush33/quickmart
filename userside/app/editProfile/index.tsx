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
      <View className="p-5 bg-white shadow-xs">
        <TouchableOpacity className="absolute top-4 left-4 bg-white p-2 rounded-full">
          <Ionicons name="arrow-back-circle" size={30} color="#00CCBB" />
        </TouchableOpacity>
        <View>
          <Text className="text-xl font-bold text-center">
            Update your details
          </Text>
        </View>
      </View>

      <KeyboardAvoidingView
        className="flex-1 px-4 bg-white"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <View className="mb-4">
            <Text className="text-xl font-bold mb-2 text-black">
              First Name
            </Text>
            <TextInput
              className="bg-white p-3 rounded-xl mb-4 border border-gray-300"
              value={firstName}
              onChangeText={setFirstName}
            />
          </View>

          <View className="mb-4">
            <Text className="text-xl font-bold mb-2 text-black">Last Name</Text>
            <TextInput
              className="bg-white p-3 rounded-xl mb-4 border border-gray-300"
              value={lastName}
              onChangeText={setLastName}
            />
          </View>

          <View className="mb-4">
            <Text className="text-xl font-bold mb-2 text-black">
              Phone Number
            </Text>
            <TextInput
              className="bg-white p-3 rounded-xl mb-4 border border-gray-300"
              value={phoneNumber}
              onChangeText={handlePhoneNumberChange}
              keyboardType="phone-pad"
            />
            {phoneNumberError ? (
              <Text style={{ color: "red" }}>{phoneNumberError}</Text>
            ) : null}
          </View>

          <View className="mb-4">
            <Text className="text-xl font-bold mb-2 text-black">
              Street Address
            </Text>
            <TextInput
              className="bg-white p-3 rounded-xl mb-4 border border-gray-300"
              value={address}
              onChangeText={setAddress}
            />
          </View>

          {/* Placeholder for map */}
          <View className="mt-4 mb-6 h-40 rounded-2xl overflow-hidden border border-gray-300 items-center justify-center bg-gray-100">
            <Text className="text-gray-500">Map placeholder</Text>
          </View>

          <PrimaryButton
            isPrimary={true}
            onPressFunction={() => {}}
            loading={false}
            title="Update"
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
