import { View, Text, SafeAreaView, StatusBar } from "react-native";

export default function Profile() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <StatusBar barStyle="dark-content" />
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ fontSize: 20, fontWeight: "600" }}>Profile Screen</Text>
      </View>
    </SafeAreaView>
  );
}
