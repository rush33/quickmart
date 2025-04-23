import "../../global.css";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { View, Text, FlatList, Alert } from "react-native";
import Header from "../../components/Header";
import ShopCard from "../../components/ShopCard";
import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchShops } from "@/redux/slices/shopSlice";
import { categories } from "@/constants/categories";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as Location from "expo-location";
import { getUserData } from "@/utils/userData";

export default function Index() {
  const dispatch = useDispatch<AppDispatch>();
  const {
    data: shopData,
    loading,
    error,
  } = useSelector((state: RootState) => state.shop);

  const [selectedAddress, setSelectedAddress] = useState(
    "Fetching location..."
  );
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["20%"], []);

  useEffect(() => {
    dispatch(fetchShops());
    getLocationAsync();
  }, [dispatch]);

  const openBottomSheet = () => bottomSheetRef.current?.expand();

  // const handleAddressSelect = (address: string) => {
  //   setSelectedAddress(address);
  //   bottomSheetRef.current?.close();
  // };

  const getLocationAsync = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission denied", "Location permission is required.");
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const [addressObj] = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      console.log(
        "lat, long",
        location.coords.latitude,
        location.coords.longitude
      );

      // const addressString = `${addressObj.city}`;
      setSelectedAddress(`${addressObj.city}`);
      const userData = await getUserData();
      const updatedUserData = {
        ...userData,
        coords: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        },
      };
      await ReactNativeAsyncStorage.setItem(
        "userData",
        JSON.stringify(updatedUserData)
      );
    } catch (err) {
      console.error("Error getting location:", err);
      setSelectedAddress("Unable to get location");
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View className="flex-1 bg-white">
        <Header address={selectedAddress} onPressLocation={openBottomSheet} />

        <FlatList
          data={[...categories]}
          keyExtractor={(item, index) => `category-${index}`}
          renderItem={({ item }) => (
            <View className="mb-4 px-4">
              <Text className="text-lg font-bold mb-2">{item.title}</Text>
              <FlatList
                data={item.items}
                numColumns={4}
                keyExtractor={(subItem, idx) => `${item.title}-${idx}`}
                renderItem={({ item: subItem }) => (
                  <View className="w-1/4 p-2 items-center">
                    <Text className="text-xs text-center mt-1">
                      {subItem.name}
                    </Text>
                  </View>
                )}
              />
            </View>
          )}
          ListFooterComponent={
            loading ? (
              <Text>Loading...</Text>
            ) : (
              <View className="px-4">
                {shopData.map((shop) => (
                  <ShopCard key={shop.id} shop={shop} />
                ))}
              </View>
            )
          }
        />

        {/* Bottom Sheet for Address Selection */}
        <BottomSheet
          ref={bottomSheetRef}
          snapPoints={snapPoints}
          index={-1}
          enablePanDownToClose={true}
        >
          <BottomSheetView style={{ padding: 20 }}>
            <Text>Location change will be supported soon!</Text>
          </BottomSheetView>
        </BottomSheet>
      </View>
    </GestureHandlerRootView>
  );
}
