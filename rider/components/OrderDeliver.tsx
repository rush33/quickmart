import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Pressable,
  Linking,
  ActivityIndicator,
  Alert,
} from "react-native";
import { FontAwesome5, Fontisto } from "@expo/vector-icons";
import { FullOrder } from "@/types/Order";
import { useAuth } from "@/context/AuthContext";
import { db, fetchFilteredData } from "@/firebase";
import { doc, onSnapshot, updateDoc, where } from "firebase/firestore";
import { Rider } from "@/types/Rider";

type Props = {
  selectedOrder: FullOrder;
  onBackPressed: (pressed: boolean) => void;
};

const OrderDeliver: React.FC<Props> = ({ selectedOrder, onBackPressed }) => {
  const { order, shop, user } = selectedOrder;
  const [currentOrder, setCurrentOrder] = useState(order);
  const [loading, setLoading] = useState(false);
  const [riderData, setRiderData] = useState<Rider[]>([]);
  const { user: rider } = useAuth();

  useEffect(() => {
    if (!order.orderId) return;
    fetchRiderData();

    const orderRef = doc(db, "orders", order.orderId);
    const unsubscribe = onSnapshot(orderRef, (snapshot) => {
      if (snapshot.exists()) {
        const updatedOrder = snapshot.data();
        setCurrentOrder({ ...currentOrder, ...updatedOrder });
      }
    });

    return () => unsubscribe();
  }, [order.orderId]);

  const fetchRiderData = async () => {
    const data = (await fetchFilteredData("riders", [
      where("riderId", "==", rider?.uid),
    ])) as Rider[];
    console.log("data", data);
    setRiderData(data);
  };

  const openNavigation = (latitude: number, longitude: number) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}&travelmode=driving`;
    Linking.openURL(url).catch((err) =>
      console.error("Navigation error:", err)
    );
  };

  const onButtonPressed = async () => {
    if (!order.orderId) return;
    setLoading(true);
    const orderRef = doc(db, "orders", order.orderId);

    try {
      try {
        if (currentOrder.status === "READY") {
          if (!riderData[0]) {
            console.warn("No rider data found");
            setLoading(false);
            return;
          }

          await updateDoc(orderRef, {
            riderName: riderData[0].fname,
            riderPhone: riderData[0].phoneNumber,
            riderId: riderData[0].id,
            status: "OUTFORDELIVERY",
          });

          console.log("Order updated to OUTFORDELIVERY");
        } else if (currentOrder.status === "OUTFORDELIVERY") {
          await updateDoc(orderRef, {
            status: "COMPLETED",
          });

          Alert.alert("Order Delivered Successfully", undefined, [
            {
              text: "OK",
              onPress: () => {
                onBackPressed(true);
              },
            },
          ]);
          console.log("Order marked as COMPLETED");
        }
      } catch (error) {
        console.error("Error updating order:", error);
      } finally {
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error updating order:", error);
    }
  };
  const renderButtonTitle = () => {
    if (currentOrder.status === "READY") return "Accept Order ✅";
    if (currentOrder.status === "OUTFORDELIVERY") return "Mark as Complete ☑️";
    return "";
  };

  return (
    <View className="flex-1 px-6 py-4 justify-between">
      {/* Order Details */}
      <View>
        <Text className="text-xl font-bold mb-4">{shop?.name}</Text>

        <View className="flex-row items-center mb-2">
          <Fontisto name="shopping-store" size={16} color="gray" />
          <Text className="ml-2 text-base text-gray-500">{shop?.address}</Text>
        </View>

        <View className="flex-row items-center mb-2">
          <FontAwesome5 name="user" size={16} color="gray" />
          <Text className="ml-2 text-base text-gray-500">
            {user?.fname} {user?.lastName ?? ""}
          </Text>
        </View>

        <View className="flex-row items-center mb-4">
          <FontAwesome5 name="map-marker-alt" size={16} color="gray" />
          <Text className="ml-2 text-base text-gray-500">{order.address}</Text>
        </View>

        <View className="border-t border-gray-200 pt-4">
          {order.items.map((item, index) => (
            <View key={index} className="flex-row justify-between mb-2">
              <Text className="text-base text-gray-700">{item.name}</Text>
              <Text className="text-base text-gray-700">x {item.quantity}</Text>
            </View>
          ))}
        </View>

        {/* Navigation Buttons */}
        {/* Navigation Buttons */}
        <View className="flex-row justify-between mt-6">
          <Pressable
            className="w-[48%] bg-blue-600 rounded-xl p-5"
            onPress={() => {
              if (shop?.lat != null && shop?.long != null) {
                openNavigation(shop?.lat, shop?.long);
              } else {
                console.warn("Shop coordinates not available");
              }
            }}
          >
            <Text className="text-white text-center text-[17px] font-semibold">
              Directions To Shop 🏪
            </Text>
          </Pressable>

          <Pressable
            className="w-[48%] bg-purple-600 rounded-xl p-5"
            onPress={() => {
              if (
                order.userCoords.latitude != null &&
                order.userCoords.longitude != null
              ) {
                openNavigation(
                  order.userCoords.latitude,
                  order.userCoords.longitude
                );
              } else {
                console.warn("User coordinates not available");
              }
            }}
          >
            <Text className="text-white text-center text-[17px] font-semibold">
              Directions To Customer 👤
            </Text>
          </Pressable>
        </View>
      </View>

      {/* Action Buttons at Bottom */}
      <View className="mt-6">
        {currentOrder.status === "READY" && (
          <Pressable
            className="bg-gray-800 rounded-md py-3 mb-3"
            onPress={() => onBackPressed(true)}
          >
            <Text className="text-white text-center text-base font-semibold">
              Back
            </Text>
          </Pressable>
        )}

        <Pressable
          className="bg-[#3FC060] rounded-md py-3"
          onPress={onButtonPressed}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white text-center text-base font-semibold">
              {renderButtonTitle()}
            </Text>
          )}
        </Pressable>
      </View>
    </View>
  );
};

export default OrderDeliver;
