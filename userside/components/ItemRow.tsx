import { View, Text, Image, TouchableOpacity } from "react-native";
import { Item } from "@/types/item";
import { CartItem } from "@/types/cartItem";
import {
  addToCart,
  removeFromCart,
  selectCartItemById,
} from "@/redux/slices/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";

type Props = {
  item: Item;
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
    <View className="flex-row justify-between items-start mb-6 px-4">
      <View className="flex-1 pr-4">
        {/* Name with green dot */}
        <View className="flex-row items-center gap-2 mb-1">
          <View className="w-4 h-4 border border-green-600 items-center justify-center">
            <View className="w-2 h-2 rounded-full bg-green-600" />
          </View>

          <View className="flex-row items-center gap-1">
            <Text
              className="text-lg font-semibold text-gray-800"
              numberOfLines={2}
            >
              {item.name}
            </Text>
          </View>
        </View>

        {/* Price */}
        <Text className="text-lg font-medium text-gray-800 mb-1">
          ₹{item.price}{" "}
          <Text className="text-xs text-gray-500">
            {item.amount} {item.unit}
          </Text>
        </Text>

        {/* Description */}
        {item.description ? (
          <Text
            className="text-xs text-gray-600"
            numberOfLines={3}
            ellipsizeMode="tail"
          >
            {item.description}
          </Text>
        ) : null}
      </View>

      <View className="w-28 items-center relative">
        <Image source={{ uri: item.image }} className="w-28 h-28 rounded-lg" />

        {itemCountInCart === 0 ? (
          <TouchableOpacity
            className="bg-white border border-green-600 rounded-lg px-5 py-1.5 absolute bottom-0"
            onPress={handleAddToCart}
          >
            <Text className="text-green-600 font-medium">ADD</Text>
          </TouchableOpacity>
        ) : (
          <View className="flex-row items-center bg-white border border-gray-300 rounded-lg absolute bottom-0">
            <TouchableOpacity
              className="px-3 py-1"
              onPress={handleRemoveFromCart}
            >
              <Text className="text-green-600 text-xl font-medium">−</Text>
            </TouchableOpacity>
            <Text className="px-2 text-base text-gray-800">
              {itemCountInCart}
            </Text>
            <TouchableOpacity className="px-3 py-1" onPress={handleAddToCart}>
              <Text className="text-green-600 text-xl font-medium">＋</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}
