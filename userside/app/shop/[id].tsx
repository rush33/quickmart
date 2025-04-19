import {
  Text,
  View,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, router } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { useEffect } from "react";
import { fetchItemsByShopId } from "@/redux/slices/itemsSlice";
import { selectCartItems } from "@/redux/slices/cartSlice";
import ItemRow from "@/components/ItemRow";
import CartButton from "@/components/CartButton";
import { ShopDetailsCard } from "@/components/ShopDetailsCard";

export default function ShopDetails() {
  const { id } = useLocalSearchParams();
  const shopId = Array.isArray(id) ? id[0] : id;
  const dispatch = useDispatch<AppDispatch>();

  const shop = useSelector((state: RootState) =>
    state.shop.data.find((s) => s.id === shopId)
  );
  const items = useSelector((state: RootState) => state.shopProducts.data);
  const itemsLoading = useSelector(
    (state: RootState) => state.shopProducts.loading
  );
  const cartItems = useSelector(selectCartItems);

  useEffect(() => {
    if (shopId) {
      dispatch(fetchItemsByShopId(shopId));
    }
  }, [shopId]);

  if (!shop) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white">
        <Text>Shop not found.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />

      <ScrollView showsVerticalScrollIndicator={false}>
        <ShopDetailsCard shop={shop} />
        {/* Items List */}
        <View className="px-4 py-2">
          <Text className="text-lg font-semibold mb-2">Items</Text>

          {itemsLoading ? (
            <Text>Loading items...</Text>
          ) : items.length === 0 ? (
            <Text>No items found for this shop.</Text>
          ) : (
            items.map((item) => <ItemRow key={item.itemId} item={item} />)
          )}
        </View>
      </ScrollView>

      {cartItems.length > 0 && <CartButton />}
    </SafeAreaView>
  );
}
