import React, { useState } from "react";
import {
  FlatList,
  Image,
  Text,
  View,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { useSelector } from "react-redux";
import Search from "@/components/Search";
import { RootState } from "@/redux/store";
import { router } from "expo-router";

const SearchScreen = () => {
  const [searchValue, setSearchValue] = useState("");

  const {
    data: items,
    loading,
    error,
  } = useSelector((state: RootState) => state.shopProducts);

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <View className="flex-1 bg-white">
      <Search
        onChangeText={setSearchValue}
        value={searchValue}
        autoFocus
        showBackButton={true}
        onBackPress={() => router.back()}
      />

      {loading && (
        <Text className="text-center text-base text-gray-600 mt-4">
          Loading...
        </Text>
      )}

      {error && <Text className="text-center text-red-500 mt-4">{error}</Text>}

      <FlatList
        data={filteredItems}
        keyExtractor={(item) => item.itemId}
        numColumns={3}
        renderItem={({ item }) => (
          <View className="w-1/3 p-2">
            <Pressable onPress={() => router.push(`/shop/${item.shopId}`)}>
              <View className="bg-white border border-gray-50 rounded-xl p-3 shadow-sm">
                {item.image && (
                  <Image
                    source={{ uri: item.image }}
                    className="w-full h-32 rounded-xl mb-2"
                    resizeMode="contain"
                  />
                )}

                <Text className="text-xs text-gray-500 mb-1">
                  {item.amount} {item.unit}
                </Text>

                <Text className="text-sm font-medium text-gray-800">
                  {item.name.length > 40
                    ? item.name.slice(0, 40) + "..."
                    : item.name}
                </Text>

                <Text className="text-sm font-bold text-gray-900 mt-1">
                  ₹{item.price}
                </Text>
              </View>
            </Pressable>
          </View>
        )}
        ListEmptyComponent={
          <Text className="text-center mt-4 text-gray-400">
            No matching items found.
          </Text>
        }
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    </View>
  );
};

export default SearchScreen;
