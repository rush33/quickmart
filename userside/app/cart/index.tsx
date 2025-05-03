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
import { router } from "expo-router";
import PrimaryButton from "@/components/PrimaryButton";

export default function CartScreen() {
  const items = useSelector(selectCartItems);
  const itemTotal = useSelector(selectCartTotal);
  const dispatch = useDispatch<AppDispatch>();
  const shopId = items[0]?.shopId;
  const shop = useSelector((state: RootState) =>
    state.shop.data.find((s) => s.id === shopId)
  );
  const cartLoading = useSelector((state: RootState) => state.order.loading);
  const subTotal = itemTotal + 40;

  const handleOrder = async () => {
    try {
      const user = await getUserData();
      if (!user) throw new Error("User data not found");
      if (!items?.length) throw new Error("No items in cart");
      if (!shopId) throw new Error("Shop ID missing from cart items");
      if (
        !user.coords ||
        user.coords.latitude == null ||
        user.coords.longitude == null
      ) {
        throw new Error("User coordinates are missing");
      }

      const orderPayload = {
        userId: user.userId,
        address: "Jorehaut",
        items: items,
        shopId: shopId,
        shopName: shop?.name || "",
        status: orderStatuses.pending,
        totalAmount: subTotal,
        userCoords: {
          latitude: user.coords.latitude,
          longitude: user.coords.longitude,
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
      <View className="p-4 bg-white shadow-xs">
        <Text className="text-xl font-bold text-center">My Orders</Text>
      </View>
      <TouchableOpacity
        onPress={() => router.back()}
        className="absolute top-4 left-4 bg-white p-1 rounded-full"
      >
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>

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
            <Text className="text-sm font-normal">Item Toal</Text>
            <Text className="text-sm font-normal">₹{itemTotal.toFixed(2)}</Text>
          </View>
          <View className="flex-row justify-between mb-4">
            <Text className="text-sm font-normal">Delivery Fee</Text>
            <Text className="text-sm font-normal">₹40</Text>
          </View>
          <View className="flex-row justify-between mb-4">
            <Text className="text-lg font-semibold">To Pay</Text>
            <Text className="text-lg font-semibold">
              ₹{subTotal.toFixed(2)}
            </Text>
          </View>
          {/* <TouchableOpacity
            className="bg-blue-600 py-4 rounded-xl items-center"
            onPress={handleOrder}
          >
            <Text className="text-white text-lg font-semibold">
              Place Order
            </Text>
          </TouchableOpacity> */}
          <PrimaryButton
            isPrimary={true}
            loading={cartLoading}
            title="Place Order"
            onPressFunction={handleOrder}
          />
        </View>
      )}
    </SafeAreaView>
  );
}
