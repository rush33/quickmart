import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import Toast from "react-native-toast-message";

import PrimaryButton from "@/components/PrimaryButton";
import InputBox from "@/components/InputBox";
import { getUserData } from "@/utils/userData";
import { User } from "@/types/user";
import { useAuth } from "@/context/AuthContext";

export default function EditProfile(): JSX.Element {
  const { updateUserData } = useAuth();
  const [originalData, setOriginalData] = useState<User | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumberError, setPhoneNumberError] = useState("");
  const [isModified, setIsModified] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      const userData = await getUserData();
      if (userData) {
        setFirstName(userData.fname || "");
        setLastName(userData?.lastName || "");
        setPhoneNumber(userData.phoneNumber || "");
        setAddress(userData.address || "");
        setOriginalData(userData);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    if (!originalData) return;

    const changed =
      firstName !== originalData.fname ||
      lastName !== originalData.lastName ||
      phoneNumber !== originalData.phoneNumber ||
      address !== originalData.address;

    setIsModified(changed);
  }, [firstName, lastName, phoneNumber, address, originalData]);

  const handlePhoneNumberChange = (text: string) => {
    const formatted = text.replace(/\D/g, "").slice(0, 10);
    setPhoneNumber(formatted);
    setPhoneNumberError(
      formatted.length !== 10 ? "Phone number must be 10 digits." : ""
    );
  };

  const handleUpdate = async () => {
    try {
      await updateUserData({
        fname: firstName,
        lastName,
        phoneNumber,
        address,
      });

      Toast.show({
        position: "bottom",
        swipeable: true,
        text1Style: "",
        type: "success",
        text1: "Profile updated successfully",
      });

      setTimeout(() => {
        router.back();
      }, 1500);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Update failed",
        text2: "Please try again later",
      });
    }
  };

  return (
    <SafeAreaView className="bg-white flex-1">
      <View className="p-5 bg-white shadow-xs mb-5">
        <TouchableOpacity
          className="absolute top-4 left-4 bg-white p-2 rounded-full"
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back-outline" size={22} color="#000000" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-center">
          Update your details
        </Text>
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
              <Text className="text-red-600">{phoneNumberError}</Text>
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
        </ScrollView>
      </KeyboardAvoidingView>

      <View className="p-5">
        <PrimaryButton
          isPrimary={true}
          onPressFunction={handleUpdate}
          loading={false}
          title="Update"
          disabled={!isModified || !!phoneNumberError}
        />
      </View>
    </SafeAreaView>
  );
}
