import React from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Button,
} from "react-native";
import { useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import { auth } from "@/utils/firebaseConfig";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

type QuickActionProps = {
  icon: keyof typeof MaterialIcons.glyphMap;
  text: string;
};

type SectionProps = {
  title: string;
  children: React.ReactNode;
};

type ProfileOptionProps = {
  icon: keyof typeof MaterialIcons.glyphMap;
  text: string;
};

export default function Profile(): JSX.Element {
  const router = useRouter();

  const handleLogout = async (): Promise<void> => {
    await signOut(auth);
    await ReactNativeAsyncStorage.removeItem("userData");
    router.push("/(auth)/Onboarding");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      {/* Account Info */}
      <View
        style={{ padding: 24, borderBottomWidth: 1, borderBottomColor: "gray" }}
      >
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>Angana Baruah</Text>
        <Text style={{ color: "gray", marginTop: 4 }}>9365730684</Text>
      </View>

      {/* Quick Actions */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          backgroundColor: "#f5f5f5",
          paddingVertical: 16,
          borderBottomWidth: 1,
          borderBottomColor: "gray",
        }}
      >
        <QuickAction icon="support-agent" text="Support" />
        <QuickAction icon="payment" text="Payments" />
      </View>

      <ScrollView style={{ padding: 16 }}>
        <Section title="Your Information">
          <ProfileOption icon="receipt" text="Your orders" />
          <ProfileOption icon="bookmark" text="Bookmarked recipes" />
          <ProfileOption icon="location-on" text="Address book" />
          <ProfileOption icon="assignment" text="GST details" />
          <ProfileOption icon="card-giftcard" text="E-Gift Cards" />
        </Section>

        <Section title="Payments and Coupons">
          <ProfileOption icon="account-balance-wallet" text="Wallet" />
          <ProfileOption icon="payment" text="Payment settings" />
          <ProfileOption icon="local-offer" text="Collected coupons" />
        </Section>
        <Button title="Logout" onPress={handleLogout} />
      </ScrollView>
    </SafeAreaView>
  );
}

const QuickAction: React.FC<QuickActionProps> = ({ icon, text }) => (
  <View style={{ alignItems: "center" }}>
    <MaterialIcons name={icon} size={24} color="black" />
    <Text style={{ fontSize: 14, marginTop: 4 }}>{text}</Text>
  </View>
);

const Section: React.FC<SectionProps> = ({ title, children }) => (
  <View style={{ marginTop: 16 }}>
    <Text
      style={{
        color: "gray",
        fontWeight: "bold",
        fontSize: 14,
        marginBottom: 8,
      }}
    >
      {title}
    </Text>
    {children}
  </View>
);

const ProfileOption: React.FC<ProfileOptionProps> = ({ icon, text }) => (
  <TouchableOpacity
    style={{
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: "gray",
    }}
  >
    <MaterialIcons
      name={icon}
      size={24}
      color="#666"
      style={{ marginRight: 16 }}
    />
    <Text style={{ flex: 1, fontSize: 16 }}>{text}</Text>
    <Ionicons name="chevron-forward" size={20} color="#999" />
  </TouchableOpacity>
);
