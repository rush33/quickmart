import { View, Text, ScrollView, Pressable } from "react-native";
import React, { useEffect } from "react";
import { Order } from "@/types/order";

const MyOrders = () => {
  useEffect(() => {}, []);

  return (
    <View className="bg-white">
      <View className="p-2 bg-white shadow-xs">
        <View>
          <Text className="text-xl font-bold text-center">My Orders</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="mb-20">
          <OrderCard />
          <OrderCard />
          <OrderCard />
        </View>
      </ScrollView>
    </View>
  );
};

export default MyOrders;

const OrderCard = () => {
  const formattedDate = "20 Apr, 2025 08:30 PM";
  const statusText = "Delivered ✅";
  const statusColor = "text-green-500";

  return (
    <View className="flex items-center justify-center">
      <Pressable className="px-6 py-6 mt-4 bg-white w-11/12 h-auto rounded-2xl flex-row justify-between items-center border border-gray-100 shadow shadow-gray-300">
        <View className="w-full">
          <Text className={`font-bold text-2xl ${statusColor}`}>
            {statusText}
          </Text>
          <Text className="text-sm pt-1 text-gray-700">{formattedDate}</Text>
          <Text className="text-sm pt-1 text-gray-700">Order ID #12345678</Text>

          <View className="mt-3">
            <Text className="text-gray-800 font-semibold">× 2 Butter Naan</Text>
            <Text className="text-gray-800 font-semibold">
              × 1 Chicken Curry
            </Text>
          </View>

          <View className="flex-row justify-between mt-4">
            <Text className="font-semibold text-lg text-gray-700">
              Order Total:
            </Text>
            <Text className="font-semibold text-lg text-gray-700">Rs. 480</Text>
          </View>

          <View className="flex-row justify-between">
            <Text className="font-semibold text-lg text-gray-700">From:</Text>
            <Text className="font-semibold text-lg text-gray-700">
              Spice Garden
            </Text>
          </View>
        </View>
      </Pressable>
    </View>
  );
};
