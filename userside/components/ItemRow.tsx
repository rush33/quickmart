import { View, Text, Image, TouchableOpacity } from "react-native";
import { item } from "@/types/item";
import { CartItem } from "@/types/cartItem";
import {
  addToCart,
  removeFromCart,
  selectCartItemById,
} from "@/redux/slices/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { MaterialIcons } from "@expo/vector-icons";

type Props = {
  item: item;
};

export default function ItemRow({ item }: Props) {
  const dispatch = useDispatch<AppDispatch>();

  const cartItem = useSelector((state: RootState) =>
    selectCartItemById(state, item.itemId)
  );

  const itemCountInCart = cartItem?.quantity || 0;

  const handleAddToCart = () => {
    const cartItem: CartItem = {
      id: item.itemId,
      name: item.name,
      price: item.price,
      shopId: item.shopId,
      quantity: 1,
      amount: item.amount,
      image: item.image,
      unit: item.unit,
    };
    dispatch(addToCart(cartItem));
  };

  const handleRemoveFromCart = () => {
    if (!cartItem || cartItem.quantity <= 0) return;
    dispatch(removeFromCart({ id: item.itemId }));
  };

  return (
    <View className="flex-row items-center mb-4 border-b border-gray-200 pb-4">
      <Image
        source={{ uri: item.image }}
        className="w-16 h-16 rounded-md mr-4"
      />
      <View className="flex-1">
        <Text className="font-semibold text-gray-900">{item.name}</Text>
        <Text className="text-sm text-gray-600">{item.description}</Text>
        <Text className="text-sm text-gray-700">
          ₹{item.price} / {item.unit}
        </Text>

        <View className="bg-white pt-3">
          <View className="flex-row items-center justify-between">
            <TouchableOpacity onPress={handleRemoveFromCart}>
              <MaterialIcons
                name="remove-circle"
                color={itemCountInCart > 0 ? "#4ade80" : "lightgray"}
                size={42}
              />
            </TouchableOpacity>

            <Text>{itemCountInCart > 0 ? itemCountInCart : " "}</Text>

            <TouchableOpacity onPress={handleAddToCart}>
              <MaterialIcons name="add-circle" color="#4ade80" size={42} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}
