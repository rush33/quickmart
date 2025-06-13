import React from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import { Entypo } from "@expo/vector-icons";
import { ExtendedOrder, Shop, User } from "@/types/Order";

type OrderItemProps = {
  order: ExtendedOrder;
  shop: Shop;
  user: User;
  onPress?: () => void;
};

const OrderItem: React.FC<OrderItemProps> = ({
  order,
  onPress,
  shop,
  user,
}) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image
        source={{ uri: shop.image || "https://via.placeholder.com/150" }}
        style={styles.image}
      />
      <View style={styles.infoContainer}>
        <Text style={styles.shopName}>{shop.name}</Text>
        <Text style={styles.address}>{shop.address}</Text>

        <Text style={styles.sectionTitle}>Delivery Details:</Text>
        <Text style={styles.detailText}>
          {user.fname} {user.lastName}
        </Text>
        <Text style={styles.detailText}>{user.address}</Text>
        <Text style={styles.detailText}>Rs. {order.totalAmount}</Text>
      </View>

      <View style={styles.iconContainer}>
        <Entypo name="check" size={30} color="white" />
      </View>
    </TouchableOpacity>
  );
};

export default OrderItem;

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    margin: 10,
    borderColor: "#3FC060",
    borderWidth: 2,
    borderRadius: 12,
  },
  image: {
    width: "25%",
    height: "100%",
    borderBottomLeftRadius: 10,
    borderTopLeftRadius: 10,
  },
  infoContainer: {
    flex: 1,
    marginLeft: 10,
    paddingVertical: 5,
  },
  shopName: {
    fontSize: 18,
    fontWeight: "700",
  },
  address: {
    color: "grey",
    fontWeight: "500",
  },
  sectionTitle: {
    marginTop: 10,
    fontWeight: "600",
  },
  detailText: {
    color: "grey",
    fontWeight: "500",
  },
  iconContainer: {
    padding: 5,
    backgroundColor: "#3FC060",
    borderBottomRightRadius: 10,
    borderTopRightRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
});
