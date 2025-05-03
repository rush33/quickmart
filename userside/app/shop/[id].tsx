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

const ShopDetails = () => {
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
      <ScrollView showsVerticalScrollIndicator={false}>
        <ShopDetailsCard shop={shop} />
        {/* Items List */}
        <View className="px-4">
          {itemsLoading ? (
            <Text className="px-4">Loading items...</Text>
          ) : items.length === 0 ? (
            <Text className="px-4">No items found for this shop.</Text>
          ) : (
            items.map((item) => <ItemRow key={item.itemId} item={item} />)
          )}
        </View>
      </ScrollView>

      {cartItems.length > 0 && <CartButton />}
    </SafeAreaView>
  );
};

export default ShopDetails;
