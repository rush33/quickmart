import { Shop } from "@/types/shop";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { TouchableOpacity, View, Text, Image } from "react-native";

type Props = {
  shop: Shop;
};

export const ShopDetailsCard = ({ shop }: Props) => {
  return (
    <>
      {/* Header */}
      <View className="bg-purple-200 h-44 relative overflow-hidden">
        <Image
          source={{ uri: shop.image }}
          className="absolute top-0 left-0 w-full h-full"
          resizeMode="cover"
        />
        <TouchableOpacity
          onPress={() => router.back()}
          className="absolute top-4 left-4 bg-white p-1 rounded-full"
        >
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {/* Shop Info */}
      <View className="bg-white mx-4 p-4 rounded-xl -mt-12 shadow-md mb-10">
        <View className="flex-row">
          <Text className="text-xl font-bold">{shop.name}</Text>
        </View>

        <Text className="text-gray-600 mt-1">{shop.address}</Text>
        <Text className="text-gray-600 mt-1">
          {(shop.genre ?? []).join(" • ")}
        </Text>
      </View>
    </>
  );
};
