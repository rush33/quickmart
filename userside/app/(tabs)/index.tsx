import "../../global.css";
import { View, Text, FlatList, Alert, Image, Pressable } from "react-native";
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
import { Platform, BackHandler, Linking } from "react-native";
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
import Search from "@/components/Search";
import { router } from "expo-router";
import { fetchAllItems } from "@/redux/slices/itemsSlice";

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
      getLocationAsync(userdata);
      console.log("user data from local db", userdata);
      dispatch(fetchShops());
      dispatch(fetchAllItems());
    };

    initialize();
  }, [dispatch]);

  const openBottomSheet = () => bottomSheetRef.current?.expand();

  const withTimeout = (promise: Promise<any>, ms: number) => {
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject(new Error("Location request timed out"));
      }, ms);

      promise
        .then((res) => {
          clearTimeout(timeoutId);
          resolve(res);
        })
        .catch((err) => {
          clearTimeout(timeoutId);
          reject(err);
        });
    });
  };

  const getLocationAsync = async (currentUser: User | null) => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Location Permission Required",
          "This app needs access to your location to function properly.\n\nPlease enable location permission from the app settings.",
          [
            {
              text: "Go to Settings",
              onPress: () => {
                Linking.openSettings();
              },
            },
            {
              text: "Exit App",
              style: "destructive",
              onPress: () => {
                if (Platform.OS === "android") {
                  BackHandler.exitApp();
                }
              },
            },
          ],
          { cancelable: false }
        );
        return;
      }

      // const location = await Location.getCurrentPositionAsync({});
      const location = await withTimeout(
        Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High }),
        20000
      );
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
    } catch (err: any) {
      console.error("Error getting location:", err);
      Alert.alert(
        "Location Error",
        err.message.includes("timed out")
          ? "Location request timed out. Please check your GPS and try again."
          : "Unable to get location. Please check your GPS settings and try again.",
        [
          {
            text: "Go to Settings",
            onPress: () => Linking.openSettings(),
          },
          {
            text: "Exit App",
            style: "destructive",
            onPress: () => {
              if (Platform.OS === "android") {
                BackHandler.exitApp();
              }
            },
          },
        ],
        { cancelable: false }
      );
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
        <Header address={selectedAddress} onPressLocation={() => {}} />

        {/* Search Bar */}
        <Pressable onPress={() => router.push("/search")}>
          <Search fake={true} />
        </Pressable>

        <FlatList
          data={[...categories]}
          keyExtractor={(item, index) => `category-${index}`}
          renderItem={({ item }) => (
            <View style={{ marginBottom: 16, paddingHorizontal: 16 }}>
              <Text
                // style={{ fontSize: 18, fontWeight: "bold", marginBottom: 8 }}
                className="font-bold text-lg mb-2"
              >
                {item.title}
              </Text>
              <FlatList
                data={item.items}
                numColumns={4}
                keyExtractor={(subItem, idx) => `${item.title}-${idx}`}
                renderItem={({ item: subItem }) => (
                  <Pressable
                    onPress={() =>
                      router.push({
                        pathname: "/search",
                        params: { searchTerm: subItem.category },
                      })
                    }
                    style={{
                      width: "25%",
                      paddingHorizontal: 8,
                      alignItems: "center",
                    }}
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
                  </Pressable>
                )}
              />
            </View>
          )}
          ListFooterComponent={
            loading ? (
              <Text className="text-center font-medium text-gray-500">
                Loading shops...
              </Text>
            ) : (
              <View style={{ paddingHorizontal: 16 }}>
                <Text className="font-bold text-lg">Browse By Shops</Text>
                {shopData.map((shop) => (
                  <ShopCard key={shop.id} shop={shop} />
                ))}
              </View>
            )
          }
        />

        <BottomSheet
          enablePanDownToClose={true}
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
