import { View, Text, ScrollView } from "react-native";
import React, { useCallback, useEffect } from "react";
import OrderCard from "../../components/OrderCard";
import { AppDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders } from "@/redux/slices/orderSlice";
import { useFocusEffect } from "expo-router";
import { getUserData } from "@/utils/userData";

const MyOrders = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data, loading } = useSelector((state: RootState) => state.order);
  const [userId, setUserId] = React.useState<string | null>(null);

  useEffect(() => {
    fetchUserData();
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (userId) {
        dispatch(fetchOrders(userId));
      }
    }, [dispatch, userId])
  );

  const fetchUserData = async () => {
    const userdata = await getUserData();
    if (userdata) {
      setUserId(userdata.userId);
    }
  };

  return loading ? (
    <View className="bg-white flex-1">
      <View className="p-2 bg-white shadow-xs">
        <Text className="text-xl font-bold text-center">My Orders</Text>
      </View>
      <Text className="text-center font-medium text-gray-500">Loading...</Text>
    </View>
  ) : (
    <View className="bg-white flex-1">
      <View className="p-2 bg-white shadow-xs">
        <Text className="text-xl font-bold text-center">My Orders</Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        <View className="mb-20">
          {data.length === 0 ? (
            <View className="flex-1 items-center justify-center mt-10">
              <Text className="text-gray-500 text-lg">No orders yet</Text>
            </View>
          ) : (
            data.map((order) => <OrderCard key={order.orderId} order={order} />)
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default MyOrders;
