import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";

type HeaderProps = {
  address: string;
  onPressLocation: () => void;
};

const Header = ({ address, onPressLocation }: HeaderProps) => {
  return (
    <View style={{ padding: 16, gap: 8 }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <TouchableOpacity
          style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
          onPress={onPressLocation}
        >
          <MaterialIcons name="location-on" size={24} color="#FF4D00" />
          <View>
            <Text style={{ fontSize: 18, fontWeight: "600" }}>{address}</Text>
            {/* <Text style={{ color: "#666" }}>
              Tap to change location
            </Text> */}
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Header;
