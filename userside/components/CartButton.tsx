import { View, TouchableOpacity, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useSelector } from "react-redux";
import { selectCartItems } from "@/redux/slices/cartSlice";

export default function CartButton() {
  const router = useRouter();
  const cartItemCount = useSelector(selectCartItems);

  return (
    <View className="absolute bottom-6 right-4">
      <TouchableOpacity
        onPress={() => router.push("/cart")}
        className="bg-black px-4 py-3 rounded-full flex-row items-center space-x-2 shadow-lg"
      >
        <Ionicons name="cart" size={20} color="white" />
        <Text className="text-white font-medium">
          Go to Cart ({cartItemCount.length})
        </Text>
      </TouchableOpacity>
    </View>
  );
}
