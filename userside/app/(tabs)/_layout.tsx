import { Tabs, useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { tintColor } from "../../constants/Colors";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: tintColor,
        headerShown: false,
        tabBarStyle: {
          height: 55,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "700",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <Feather name="home" size={23} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="myOrders"
        options={{
          title: "Orders",
          tabBarIcon: ({ color }) => (
            <Feather name="archive" size={23} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <Feather name="user" size={23} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
