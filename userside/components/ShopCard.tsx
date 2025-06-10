import { View, Text, Image, TouchableOpacity } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Shop } from "@/types/shop";

type ShopCardProps = {
  shop: Shop;
};

export default function ShopCard({ shop }: ShopCardProps) {
  return (
    <TouchableOpacity
      onPress={() => router.push(`/shop/${shop.id}`)}
      className="flex-row p-4 border-b border-gray-200 gap-3"
    >
      {/* Shop Image */}
      <View className="relative">
        <Image
          source={{ uri: shop.image }}
          className="w-[120px] h-[120px] rounded-lg"
        />
        <TouchableOpacity className="absolute top-2 right-2 bg-white/90 rounded-full p-1">
          <Ionicons name="heart-outline" size={20} color="#666" />
        </TouchableOpacity>
      </View>

      {/* Shop Details */}
      <View className="flex-1 gap-1">
        <Text className="text-xl font-semibold">{shop.name}</Text>
        <View className="flex-row items-center gap-1">
          <View className="bg-[#48C479] px-1 py-0.5 rounded flex-row items-center gap-0.5">
            <Text className="text-white">4.2</Text>
            <Ionicons name="star" size={12} color="white" />
          </View>
        </View>

        <Text className="text-gray-600">{shop.genre.join(", ")}</Text>
        <Text className="text-gray-600">{shop.address}</Text>
      </View>
    </TouchableOpacity>
  );
}
