import React, { useEffect, useState } from "react";
import { FlatList, Image, Text, View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { fetchFilteredData } from "@/utils/firebase";
import { where } from "firebase/firestore";
import { Order } from "@/types/order";
import { CartItem } from "@/types/cartItem";

const OrderDetails = () => {
  const { id } = useLocalSearchParams();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const orderData = await fetchFilteredData("orders", [
          where("orderId", "==", id),
        ]);

        if (orderData.length > 0) {
          const [order] = orderData;
          setOrder(order);
        } else {
          console.log("Order not found");
        }
      } catch (error) {
        console.error("Error fetching order details:", error);
      }
    };

    id && fetchOrderDetails();
  }, [id]);

  const renderItem = ({ item }: { item: CartItem }) => (
    <View className="flex-row p-4 mb-3 bg-white rounded-xl shadow-sm">
      <Image source={{ uri: item.image }} className="w-20 h-20 rounded-lg" />
      <View className="flex-1 ml-4 justify-center">
        <Text className="text-lg font-semibold text-gray-800">{item.name}</Text>
        <Text className="text-base text-primary mt-1">₹{item.price}</Text>
        <Text className="text-sm text-gray-500 mt-1">Qty: {item.quantity}</Text>
      </View>
    </View>
  );

  if (!order) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <Text className="text-gray-600">Loading order details...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <View className="bg-white p-6 rounded-b-xl shadow-sm">
        <Text className="text-2xl font-bold text-gray-800 mb-2">
          Order Details
        </Text>

        <View className="flex-row items-center mb-4">
          <View
            className={`px-3 py-1 rounded-full ${
              order.status === "completed"
                ? "bg-green-100"
                : order.status === "pending"
                ? "bg-yellow-100"
                : "bg-red-100"
            }`}
          >
            <Text
              className={`text-sm font-medium ${
                order.status === "completed"
                  ? "text-green-800"
                  : order.status === "pending"
                  ? "text-yellow-800"
                  : "text-red-800"
              }`}
            >
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </Text>
          </View>
        </View>

        <View className="space-y-4">
          <View>
            <Text className="text-sm text-gray-500">Order ID</Text>
            <Text className="text-base font-medium text-gray-800">
              {order.orderId}
            </Text>
          </View>

          <View>
            <Text className="text-sm text-gray-500">Delivery Address</Text>
            <Text className="text-base font-medium text-gray-800">
              {order.address}
            </Text>
          </View>

          <View>
            <Text className="text-sm text-gray-500">Total Amount</Text>
            <Text className="text-xl font-bold text-primary">
              ₹{order.totalAmount.toFixed(2)}
            </Text>
          </View>
        </View>
      </View>

      <View className="flex-1 p-4">
        <Text className="text-lg font-semibold text-gray-800 mb-3">
          Order Items
        </Text>
        <FlatList
          data={order.items}
          keyExtractor={(item, index) => `${item.name}-${index}`}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
        />
      </View>

      <TouchableOpacity
        onPress={() => router.navigate("/(tabs)")}
        className="absolute bottom-6 left-6 right-6 bg-white p-4 rounded-xl shadow-sm flex-row items-center justify-center"
      >
        <Ionicons name="arrow-back" size={20} color="#000" />
        <Text className="ml-2 text-base font-medium">Back to Home</Text>
      </TouchableOpacity>
    </View>
  );
};

export default OrderDetails;
