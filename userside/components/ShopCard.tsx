import { View, Text, Image, TouchableOpacity } from "react-native";
import { Feather, Ionicons, MaterialIcons } from "@expo/vector-icons";
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

        <View className="flex-row items-center mb-1">
          <Feather
            name="shopping-bag"
            size={13}
            color="green"
            style={{ marginRight: 3 }}
          />
          <Text className="text-gray-600 text-[12px] flex-row items-center">
            {shop.genre.join(", ")}
          </Text>
        </View>

        <View className="flex-row items-center mb-1">
          <Feather
            name="navigation"
            size={13}
            color="#ba03d9"
            style={{ marginRight: 3 }}
          />
          <Text className="text-gray-600 text-[12px]">{shop.address}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
