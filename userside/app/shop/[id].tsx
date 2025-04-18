import {
  Text,
  View,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, router } from "expo-router";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

export default function ShopDetails() {
  const { id } = useLocalSearchParams();
  const shopId = Array.isArray(id) ? id[0] : id;
  const shop = useSelector((state: RootState) =>
    state.shop.data.find((s) => s.id === shopId)
  );

  if (!shop) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white">
        <Text>Shop not found.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View className="flex-row items-center px-4 py-3 border-b border-gray-200">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text className="ml-4 text-lg font-semibold">Shop Details</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Shop Image */}
        <View className="relative">
          <Image
            source={{ uri: shop.image }}
            className="w-full h-56"
            resizeMode="cover"
          />
          <TouchableOpacity className="absolute top-4 right-4 bg-white/90 rounded-full p-2">
            <Ionicons name="heart-outline" size={24} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Shop Info */}
        <View className="px-4 py-5 space-y-4">
          <Text className="text-2xl font-bold text-gray-900">{shop.name}</Text>

          <View className="flex-row items-center space-x-2">
            <View className="flex-row items-center bg-green-500 px-2 py-1 rounded-md">
              <Text className="text-white font-semibold">{shop.rating}</Text>
              <Ionicons name="star" size={14} color="white" className="ml-1" />
            </View>
            <Text className="text-gray-500 text-sm">
              ({shop.rating} reviews)
            </Text>
          </View>

          <Text className="text-base text-gray-600">
            {(shop.genre ?? []).join(" • ")}
          </Text>

          <View className="flex-row items-center space-x-2">
            <MaterialIcons name="location-on" size={20} color="#666" />
            <Text className="text-gray-600 flex-1">{shop.address} • xy</Text>
          </View>

          <View className="flex-row items-center space-x-2">
            <Ionicons name="time-outline" size={20} color="#666" />
            <Text className="text-gray-600">10:00 AM - 11:00 PM</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
