import { Order } from "@/types/order";
import { formatTimestamp } from "@/utils/formatTimestamp ";
import { useRouter } from "expo-router";
import { Pressable, View, Text } from "react-native";

const OrderCard = ({ order }: { order: Order }) => {
  const router = useRouter();
  const statusText =
    order.status === "Delivered" ? "Delivered ✅" : order.status;
  const statusColor =
    order.status === "Delivered" ? "text-green-500" : "text-orange-500";

  return (
    <View className="flex items-center justify-center">
      <Pressable
        className="px-6 py-6 mt-4 bg-white w-11/12 rounded-2xl flex-row justify-between items-center border border-gray-100 shadow shadow-gray-300"
        onPress={() => router.push(`/orders/${order.orderId}`)}
      >
        <View className="w-full">
          <Text className={`font-bold text-2xl ${statusColor}`}>
            {statusText}
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
