import React, { useEffect, useState } from "react";
import { FlatList, Image, Text, View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { Order } from "@/types/order";
import { CartItem } from "@/types/cartItem";
import { formatTimestamp } from "@/utils/formatTimestamp ";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "@/utils/firebase";

const OrderDetails = () => {
  const { id } = useLocalSearchParams();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (!id) return;

    const q = query(collection(db, "orders"), where("orderId", "==", id));
    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        if (!querySnapshot.empty) {
          const doc = querySnapshot.docs[0];
          const data = doc.data();
          setOrder({ ...data, orderId: doc.id });
        } else {
          console.log("Order not found");
        }
      },
      (error) => {
        console.error("Error listening to order:", error);
      }
    );

    return () => unsubscribe(); // cleanup on unmount
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
  console.log("order in details", order);

  return (
    <View className="flex-1 bg-gray-50">
      <View className="bg-white py-2 px-6 rounded-b-xl shadow-sm">
        <Text className="text-xl font-bold text-gray-800 mb-2 text-center">
          Order Details
        </Text>

        <View className="flex-row items-center mb-4">
          {(() => {
            const statusDisplay = {
              PENDING: { text: "Order Pending ⏳", color: "text-yellow-500" },
              PREPARING: {
                text: "Preparing Package 📦",
                color: "text-orange-500",
              },
              READY: { text: "Ready for Pickup 🚚", color: "text-green-500" },
              OUTFORDELIVERY: {
                text: "Out For Delivery 🚲",
                color: "text-green-500",
              },
              COMPLETED: { text: "Delivered ✅", color: "text-green-500" },
            };

            const statusInfo = statusDisplay[
              order.status.toUpperCase() as keyof typeof statusDisplay
            ] ?? {
              text: "Unknown Status",
              color: "text-gray-500",
            };

            return (
              <View className="px-3 py-1 rounded-full bg-gray-50">
                <Text className={`text-lg font-medium ${statusInfo.color}`}>
                  {statusInfo.text}
                </Text>
              </View>
            );
          })()}
        </View>

        <View className="gap-y-3">
          <View>
            <Text className="text-sm text-gray-500">Order ID</Text>
            <Text className="text-sm font-nomral text-gray-800">
              {order.orderId}
              <Text className="text-base pt-1 text-gray-700 font-medium">
                {""} at {formatTimestamp(order.createdAt)}
              </Text>
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
        onPress={() => router.navigate("/(tabs)/myOrders")}
        className="absolute bottom-6 left-6 right-6 bg-white p-4 rounded-xl shadow-sm flex-row items-center justify-center"
      >
        <Ionicons name="arrow-back" size={20} color="#000" />
        <Text className="ml-2 text-base font-medium">Back to My Orders</Text>
      </TouchableOpacity>
    </View>
  );
};

export default OrderDetails;
