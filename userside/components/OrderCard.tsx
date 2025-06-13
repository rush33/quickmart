import { Order } from "@/types/order";
import { formatTimestamp } from "@/utils/formatTimestamp ";
import { useRouter } from "expo-router";
import { Pressable, View, Text } from "react-native";

const statusDisplay = {
  PENDING: { text: "Order Pending ⏳", color: "text-yellow-400" },
  PREPARING: { text: "Preparing Package 📦", color: "text-orange-500" },
  READY: { text: "Ready for Pickup 🚚", color: "text-green-500" },
  OUTFORDELIVERY: { text: "Out For Delivery 🚲", color: "text-green-500" },
  COMPLETED: { text: "Delivered ✅", color: "text-green-500" },
};

const OrderCard = ({ order }: { order: Order }) => {
  const router = useRouter();
  const normalizedStatus = order.status?.toUpperCase() || "PENDING";
  const display = statusDisplay[normalizedStatus] || {
    text: "Unknown Status",
    color: "text-gray-500",
  };

  return (
    <View className="flex items-center justify-center">
      <Pressable
        className="px-6 py-6 mt-4 bg-white w-11/12 rounded-2xl flex-row justify-between items-center border border-gray-100 shadow shadow-gray-300"
        onPress={() => router.push(`/orders/${order.orderId}`)}
      >
        <View className="w-full">
          <Text className={`font-bold text-xl ${display.color}`}>
            {display.text}
          </Text>

          <Text className="text-sm pt-1 text-gray-700 font-light">
            {formatTimestamp(order.createdAt)}
          </Text>

          <Text className="text-sm pt-1 text-gray-700 font-light">
            Order ID #{order.orderId}
          </Text>

          <View className="mt-3">
            {order.items.map((item, idx) => (
              <Text key={idx} className="text-gray-800 font-normal">
                × {item.quantity} {item.name}
              </Text>
            ))}
          </View>

          <View className="flex-row justify-between mt-4">
            <Text className="font-semibold text-lg text-gray-700">
              Order Total:
            </Text>
            <Text className="font-semibold text-lg text-gray-700">
              Rs. {order.totalAmount}
            </Text>
          </View>

          <View className="flex-row justify-between">
            <Text className="font-semibold text-lg text-gray-700">From:</Text>
            <Text className="font-semibold text-lg text-gray-700">
              {order.shopName ?? "Unknown Shop"}
            </Text>
          </View>
        </View>
      </Pressable>
    </View>
  );
};

export default OrderCard;
