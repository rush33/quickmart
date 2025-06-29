import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import {
  selectCartItems,
  selectCartTotal,
  removeFromCart,
  clearCart,
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
import RazorpayCheckout from "react-native-razorpay";

interface PaymentResult {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

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
      console.log("👤 User data:", user);

      if (
        !user ||
        !items.length ||
        !shopId ||
        !user.coords?.latitude ||
        !user.coords?.longitude
      ) {
        throw new Error("Missing required order details");
      }

      const orderPayload: Order = {
        userId: user.userId,
        address: user.address,
        items,
        shopId,
        shopName: shop?.name || "",
        status: orderStatuses.pending,
        totalAmount: subTotal,
        userCoords: {
          latitude: user.coords.latitude,
          longitude: user.coords.longitude,
        },
      };

      const options = {
        description: "Order Payment",
        image: "https://your-logo-url.com/logo.png",
        currency: "INR",
        key: "rzp_test_KzHwbbsBPLIHbf",
        amount: subTotal * 100,
        name: "Swiftserve",
        prefill: {
          email: user.email || "",
          contact: user.phoneNumber || "",
          name: user.fname || "",
        },
        theme: { color: "#3399cc" },
      };

      console.log("💳 Razorpay Options:", options);

      RazorpayCheckout.open(options)
        .then(async (paymentResult: PaymentResult) => {
          console.log("✅ Payment Success:", paymentResult);

          console.log("📤 Dispatching placeOrder...");
          await dispatch(placeOrder(orderPayload));
          dispatch(clearCart());
        })
        .catch((error: any) => {
          console.error("❌ Payment failed:", error);
          Alert.alert(
            "Payment Failed",
            "Please try again.",
            [{ text: "OK", style: "default" }],
            { cancelable: true }
          );
        });
    } catch (err: any) {
      console.error("❌ Error in handleOrder:", err.message || err);
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
            <Text className="text-sm font-normal">Item Total</Text>
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
