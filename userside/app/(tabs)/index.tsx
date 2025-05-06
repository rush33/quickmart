import "../../global.css";
import { View, Text, FlatList, Alert, Image } from "react-native";
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
import {
  getUserData,
  logLocalUserData,
  updateUserDataField,
} from "@/utils/userData";
import { User } from "@/types/user";
import { useAuth } from "@/context/AuthContext";
import PrimaryButton from "@/components/PrimaryButton";
import InputBox from "@/components/InputBox";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

export default function Index() {
  const { updateUserData, user } = useAuth();
  const dispatch = useDispatch<AppDispatch>();
  const { data: shopData, loading } = useSelector(
    (state: RootState) => state.shop
  );

  const [selectedAddress, setSelectedAddress] = useState(
    "Fetching location..."
  );
  const [userData, setUserData] = useState<User | null>(null);
  const [newAddress, setNewAddress] = useState("");
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["40%"], []);

  useEffect(() => {
    const initialize = async () => {
      logLocalUserData();
      const userdata = await getUserData();
      setUserData(userdata);
      console.log("user data from local db", userdata);
      dispatch(fetchShops());
      getLocationAsync(userdata);
    };

    initialize();
  }, [dispatch]);

  const openBottomSheet = () => bottomSheetRef.current?.expand();

  const getLocationAsync = async (currentUser: User | null) => {
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

      setSelectedAddress(`${addressObj.city}`);
      console.log(
        "updated",
        addressObj.city,
        location.coords.latitude,
        location.coords.longitude
      );

      updateUserDataField({
        coords: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        },
      });

      // const updatedUserData: User = {
      //   ...userData,
      //   coords: {
      //     latitude: location.coords.latitude,
      //     longitude: location.coords.longitude,
      //   },
      // };

      // console.log("updated userdata", updatedUserData);
      // setUserData(updatedUserData);
      // await ReactNativeAsyncStorage.setItem(
      //   "userData",
      //   JSON.stringify(updatedUserData)
      // );
      // console.log("userdata state", userData);
    } catch (err) {
      console.error("Error getting location:", err);
      setSelectedAddress("Unable to get location");
    }
  };

  const handleSave = async () => {
    if (newAddress.trim() === "") return;
    const updatedUserData: User = {
      ...((userData ?? {}) as User),
      address: newAddress.trim(),
    };
    await ReactNativeAsyncStorage.setItem(
      "userData",
      JSON.stringify(updatedUserData)
    );
    console.log("userdata", updatedUserData);
    await updateUserData(updatedUserData);
    bottomSheetRef.current?.close();
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={{ flex: 1, backgroundColor: "white" }}>
        <Header address={selectedAddress} onPressLocation={openBottomSheet} />

        <FlatList
          data={[...categories]}
          keyExtractor={(item, index) => `category-${index}`}
          renderItem={({ item }) => (
            <View style={{ marginBottom: 16, paddingHorizontal: 16 }}>
              <Text
                style={{ fontSize: 18, fontWeight: "bold", marginBottom: 8 }}
              >
                {item.title}
              </Text>
              <FlatList
                data={item.items}
                numColumns={4}
                keyExtractor={(subItem, idx) => `${item.title}-${idx}`}
                renderItem={({ item: subItem }) => (
                  <View
                    style={{ width: "25%", padding: 8, alignItems: "center" }}
                  >
                    <Image
                      source={{ uri: subItem.image }}
                      style={{ width: 64, height: 64, borderRadius: 8 }}
                    />
                    <Text
                      style={{
                        fontSize: 12,
                        textAlign: "center",
                        marginTop: 4,
                      }}
                    >
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
              <View style={{ paddingHorizontal: 16 }}>
                {shopData.map((shop) => (
                  <ShopCard key={shop.id} shop={shop} />
                ))}
              </View>
            )
          }
        />

        <BottomSheet
          ref={bottomSheetRef}
          snapPoints={snapPoints}
          index={-1}
          backgroundStyle={{
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            backgroundColor: "#f2f2f2",
          }}
        >
          <BottomSheetView style={{ padding: 20 }}>
            <View>
              <Text style={{ fontSize: 14, marginBottom: 12 }}>
                Current Address
              </Text>
              <InputBox
                placeholder="Enter your address"
                value={newAddress}
                onChangeText={setNewAddress}
              />
              <PrimaryButton
                isPrimary={true}
                onPressFunction={handleSave}
                loading={false}
                title="Save"
              />
            </View>
          </BottomSheetView>
        </BottomSheet>
      </View>
    </GestureHandlerRootView>
  );
}
