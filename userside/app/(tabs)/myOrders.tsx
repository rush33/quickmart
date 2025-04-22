import { View, Text, ScrollView } from "react-native";
import React, { useEffect } from "react";
import OrderCard from "../../components/OrderCard";
import { AppDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders } from "@/redux/slices/orderSlice";

const MyOrders = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data, loading } = useSelector((state: RootState) => state.order);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  return loading ? (
    <View>
      <Text>Loading...</Text>
    </View>
  ) : (
    <View className="bg-white flex-1">
      <View className="p-2 bg-white shadow-xs">
        <Text className="text-xl font-bold text-center">My Orders</Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        <View className="mb-20">
          {data.map((order) => (
            <OrderCard key={order.orderId} order={order} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default MyOrders;
