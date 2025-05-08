import React, { useEffect, useState } from "react";
import { StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import MapView from "react-native-maps";
import * as Location from "expo-location";

export default function Home() {
  const [location, setLocation] = useState<Location.LocationObjectCoords | null>(null);
  const [loading, setLoading] = useState(true);

  const order = {
    title: "Amul Taaza, Smoodh + 5 more..",
    price: 350,
    location: {
      latitude: 37.78825,
      longitude: -122.4324,
    },
  };

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location.coords);
      setLoading(false);
    })();
  }, []);

  const { width, height } = useWindowDimensions();

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <MapView
          style={{ height, width }}
          showsUserLocation
          initialRegion={{
            latitude: location?.latitude || 0,
            longitude: location?.longitude || 0,
            latitudeDelta: 0.005, 
            longitudeDelta: 0.005,
          }}
        />
        <View style={styles.bottomView}>
          <Text style={styles.onlineText}>You're Online</Text>
          <Text style={styles.subText}>Available Orders: 1</Text>

          <View style={styles.orderCard}>
            <Text style={styles.orderTitle}>Angana Boruah</Text>
            <Text style={styles.orderPrice}>{order.title}</Text>
            <Text style={styles.orderPrice}>₹{order.price}</Text>
            <Text style={styles.orderLocation}>Potiagaon</Text>
          </View>
        </View>
      </GestureHandlerRootView>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomView: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "white",
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
    minHeight: "30%",
  },
  onlineText: {
    fontSize: 20,
    fontWeight: "600",
    letterSpacing: 0.5,
    paddingBottom: 5,
  },
  subText: {
    letterSpacing: 0.5,
    color: "grey",
    marginBottom: 10,
  },
  orderCard: {
    width: "100%",
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    padding: 16,
    alignItems: "flex-start",
    marginTop: 10,
  },
  orderTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  orderPrice: {
    fontSize: 16,
    color: "#333",
    marginTop: 6,
  },
  orderLocation: {
    marginTop: 6,
    color: "gray",
    fontSize: 14,
  },
});
