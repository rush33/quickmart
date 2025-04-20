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

export default function CartScreen() {
  const items = useSelector(selectCartItems);
  const total = useSelector(selectCartTotal);
  const dispatch = useDispatch();

  const handleRemove = (id: string) => {
    dispatch(removeFromCart({ id }));
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
      <TouchableOpacity onPress={() => handleRemove(item.id)}>
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

      {/* Footer with Checkout */}
      {items.length > 0 && (
        <View className="absolute mb-6 bottom-0 w-full bg-white border-t border-gray-200 p-4">
          <View className="flex-row justify-between mb-4">
            <Text className="text-lg font-semibold">Subtotal</Text>
            <Text className="text-lg font-semibold">₹{total.toFixed(2)}</Text>
          </View>
          <TouchableOpacity className="bg-blue-600 py-4 rounded-xl items-center">
            <Text className="text-white text-lg font-semibold">
              Place Order
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}
