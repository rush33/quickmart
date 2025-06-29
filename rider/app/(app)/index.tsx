import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef,
} from "react";
import {
  Text,
  View,
  Platform,
  BackHandler,
  Alert,
  StyleSheet,
  Linking,
} from "react-native";
import * as Location from "expo-location";
import { LocationObjectCoords } from "expo-location";
import { db, fetchFilteredData } from "@/firebase";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { FullOrder, Order, Shop, User } from "@/types/Order";
import OrderItem from "@/components/OrderItem";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import OrderDeliver from "@/components/OrderDeliver";
import { useAuth } from "@/context/AuthContext";

export default function Home() {
  const [location, setLocation] = useState<LocationObjectCoords | null>(null);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<FullOrder[]>([]);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [selectedOrder, setSelectedOrder] = useState<FullOrder | null>(null);
  const [backPressed, setBackPressed] = useState(false);
  const { SignOut } = useAuth();

  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
  }, []);

  const handleBackPressed = (pressed: boolean) => {
    if (pressed) {
      bottomSheetRef.current?.close(); // 👈 closes the bottom sheet
      setBackPressed(false); // optional: reset flag if used elsewhere
    }
  };

  useEffect(() => {
    let unsubscribe: () => void;

    (async () => {
      const q = query(
        collection(db, "orders"),
        where("status", "in", ["READY", "OUTFORDELIVERY"])
      );
      unsubscribe = onSnapshot(q, async (snapshot) => {
        const orderDocs = snapshot.docs.map((doc) => ({
          orderId: doc.id,
          ...doc.data(),
        }));

        const enrichedOrders: FullOrder[] = await Promise.all(
          orderDocs.map(async (order: any) => {
            const shopSnap = await getDoc(doc(db, "shops", order.shopId));
            const userSnap = await getDoc(doc(db, "users", order.userId));

            const shop = shopSnap.exists() ? (shopSnap.data() as Shop) : null;
            const user = userSnap.exists() ? (userSnap.data() as User) : null;

            return {
              order,
              shop,
              user,
            };
          })
        );

        setOrders(enrichedOrders);
        console.log("Live orders:", enrichedOrders);
      });

      // 📍 Location permission and fetching
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Location Permission Required",
          "This app needs access to your location to function properly.\n\nPlease enable location permission from the app settings.",
          [
            {
              text: "Go to Settings",
              onPress: () => {
                Linking.openSettings(); // opens the app settings
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

      const location = await Location.getCurrentPositionAsync({});
      setLocation(location.coords);
      console.log("User location:", location.coords);
      setLoading(false);
    })();

    // 🧹 Clean up Firestore listener on unmount
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  return (
    <GestureHandlerRootView style={styles.container}>
      <View className="flex-1 bg-white px-4 pt-4">
        {/* Header with status + logout */}
        <View className="flex-row justify-between items-center mx-4 mb-1">
          <Text className="text-xl font-semibold text-black">
            You're Online
          </Text>
          <Text
            className="text-blue-600 text-sm"
            onPress={async () => {
              await SignOut();
            }}
          >
            Logout
          </Text>
        </View>

        <Text className="text-gray-500 mx-4 mb-4 text-left">
          Available Orders: {orders.length}
        </Text>

        {orders.map((order, index) => (
          <OrderItem
            key={index}
            order={order.order}
            shop={order.shop}
            user={order.user}
            onPress={() => {
              setSelectedOrder(order);
              bottomSheetRef.current?.expand();
            }}
            onBackPressed={handleBackPressed}
          />
        ))}
      </View>

      <BottomSheet
        snapPoints={["100%"]}
        index={-1}
        ref={bottomSheetRef}
        enablePanDownToClose={false}
        enableContentPanningGesture={false}
        enableHandlePanningGesture={false}
        onChange={handleSheetChanges}
        backdropComponent={() => null}
      >
        <BottomSheetView>
          {selectedOrder ? (
            <OrderDeliver
              selectedOrder={selectedOrder}
              onBackPressed={handleBackPressed}
            />
          ) : (
            <Text>No order selected</Text>
          )}
        </BottomSheetView>
      </BottomSheet>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "grey",
  },
});
