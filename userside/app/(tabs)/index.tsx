import {
  SafeAreaView,
  StatusBar,
  View,
  Text,
  Image,
  FlatList,
} from "react-native";
import Header from "../../components/Header";
import ShopCard from "../../components/ShopCard";
import "../../global.css";
import { useEffect, useState } from "react";
import { fetchData } from "../../utils/firebaseConfig";
import { Shop } from "@/types/shop";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchShops } from "@/redux/slices/shopSlice";
import { categories } from "@/constants/categories";

export default function Index() {
  const dispatch = useDispatch<AppDispatch>();
  const {
    data: shopData,
    loading,
    error,
  } = useSelector((state: RootState) => state.shop);

  useEffect(() => {
    dispatch(fetchShops());
  }, [dispatch]);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="default" />
      <Header />

      {/* Main Content */}
      <FlatList
        data={[...categories]}
        keyExtractor={(item, index) => `category-${index}`}
        renderItem={({ item }) => (
          <View className="mb-4 px-4">
            <Text className="text-lg font-bold mb-2">{item.title}</Text>
            <FlatList
              data={item.items}
              numColumns={3}
              keyExtractor={(subItem, idx) => `${item.title}-${idx}`}
              renderItem={({ item: subItem }) => (
                <View className="w-1/3 p-2 items-center">
                  <Image
                    source={{ uri: subItem.image }}
                    className="w-24 h-24 rounded-lg"
                  />
                  <Text className="text-xs text-center mt-1">
                    {subItem.name}
                  </Text>
                </View>
              )}
            />
          </View>
        )}
        ListFooterComponent={
          <View className="px-4">
            {shopData.map((shop) => (
              <ShopCard key={shop.id} shop={shop} />
            ))}
          </View>
        }
      />
    </SafeAreaView>
  );
}
