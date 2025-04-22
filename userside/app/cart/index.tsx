import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import {
  selectCartItems,
  selectCartTotal,
  removeFromCart,
} from "@/redux/slices/cartSlice";
import { Ionicons } from "@expo/vector-icons";
import { CartItem } from "@/types/cartItem";
import { placeOrder } from "../../redux/slices/orderSlice";
import { orderStatuses } from "@/constants/orderStatus";
import { getUserData } from "@/utils/userData";
import { AppDispatch, RootState } from "@/redux/store";
import { Order } from "@/types/order";

export default function CartScreen() {
  const items = useSelector(selectCartItems);
  const total = useSelector(selectCartTotal);
  const dispatch = useDispatch<AppDispatch>();
  const shopId = items[0]?.shopId;
  const shop = useSelector((state: RootState) =>
    state.shop.data.find((s) => s.id === shopId)
  );

  const handleOrder = async () => {
    try {
      const user = await getUserData();
      if (!user) throw new Error("User data not found");
      if (!items?.length) throw new Error("No items in cart");
      if (!shopId) throw new Error("Shop ID missing from cart items");

      const orderPayload = {
        userId: user.userId,
        address: "Jorehaut",
        items: items,
        shopId: shopId,
        shopName: shop?.name || "",
        status: orderStatuses.pending,
        totalAmount: total,
        userCoords: {
          latitude: 10,
          longitude: 1199,
        },
      };

      console.log("📝 Order Payload:", orderPayload);

      await dispatch(placeOrder(orderPayload));

      console.log("✅ Order placed successfully");
      // TODO: reset cart, show success UI, etc.
    } catch (err: any) {
      console.error("❌ Order placement failed:", err.message || err);
    }
  };

  const renderItem = ({ item }: { item: CartItem }) => (
    <View className="bg-white rounded-2xl p-4 flex-row items-center mb-4 shadow">
      <Image
        source={{ uri: item.image }}
        className="w-20 h-20 rounded-lg mr-4"
      />
      <View className="flex-1">
        <Text className="text-lg font-semibold text-gray-900">{item.name}</Text>
        <Text className="text-sm text-gray-500">
          Pack: {item.amount}
          {item.unit}
        </Text>
        <Text className="text-sm text-gray-500">Qty: {item.quantity}</Text>
        <Text className="mt-2 text-gray-800 font-bold">
          ₹{(item.price * item.quantity).toFixed(2)}
        </Text>
      </View>
      <TouchableOpacity
        onPress={() => dispatch(removeFromCart({ id: item.id }))}
      >
        <Ionicons name="trash-outline" size={24} color="red" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="px-6 py-4 bg-white border-b border-gray-200 flex-row items-center justify-between">
        <Text className="text-xl font-bold">My Cart</Text>
        <Text className="text-lg text-gray-700">₹{total.toFixed(2)}</Text>
      </View>

      {items.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <Text className="text-gray-500">Your cart is empty</Text>
        </View>
      ) : (
        <FlatList
          data={items}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16, paddingBottom: 120 }}
        />
      )}

      {items.length > 0 && (
        <View className="absolute mb-6 bottom-0 w-full bg-white border-t border-gray-200 p-4">
          <View className="flex-row justify-between mb-4">
            <Text className="text-lg font-semibold">Subtotal</Text>
            <Text className="text-lg font-semibold">₹{total.toFixed(2)}</Text>
          </View>
          <TouchableOpacity
            className="bg-blue-600 py-4 rounded-xl items-center"
            onPress={handleOrder}
          >
            <Text className="text-white text-lg font-semibold">
              Place Order
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}
