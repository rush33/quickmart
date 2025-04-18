import {
  Text,
  View,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, router } from "expo-router";

// Dummy data lookup (replace this with actual API or global state later)
const DUMMY_SHOPS = [
  {
    id: "7WZTRydg9efSTQP0BRpL",
    name: "Pizza Planet",
    image: "https://via.placeholder.com/300",
    rating: 4.6,
    reviews: 102,
    categories: ["Pizza", "Italian"],
    location: "123 Main Street",
    distance: "1.2 km",
    timeRange: "10:00 AM - 11:00 PM",
    freeDelivery: true,
  },
  {
    id: "DtB3bgEbCgNnXraBqCXY",
    name: "Burger Barn",
    image: "https://via.placeholder.com/300",
    rating: 4.2,
    reviews: 89,
    categories: ["Burgers", "Fast Food"],
    location: "456 Burger Lane",
    distance: "0.8 km",
    timeRange: "9:00 AM - 10:00 PM",
    freeDelivery: false,
  },
];

export default function ShopDetails() {
  const { id } = useLocalSearchParams();
  const shopId = Array.isArray(id) ? id[0] : id;
  const shop = DUMMY_SHOPS.find((s) => s.id === shopId) || DUMMY_SHOPS[0]; // fallback to dummy

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={{ padding: 16, flexDirection: "row", alignItems: "center" }}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={{ marginLeft: 16, fontSize: 18, fontWeight: "600" }}>
          Shop Details
        </Text>
      </View>

      <ScrollView>
        {/* Shop Image */}
        <View style={{ position: "relative" }}>
          <Image
            source={{ uri: shop.image }}
            style={{ width: "100%", height: 200 }}
          />
          <TouchableOpacity
            style={{
              position: "absolute",
              top: 16,
              right: 16,
              backgroundColor: "rgba(255,255,255,0.9)",
              borderRadius: 20,
              padding: 8,
            }}
          >
            <Ionicons name="heart-outline" size={24} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Shop Info */}
        <View style={{ padding: 16, gap: 12 }}>
          <Text style={{ fontSize: 24, fontWeight: "600" }}>{shop.name}</Text>

          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <View
              style={{
                backgroundColor: "#48C479",
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 8,
                flexDirection: "row",
                alignItems: "center",
                gap: 4,
              }}
            >
              <Text style={{ color: "white", fontWeight: "600" }}>
                {shop.rating}
              </Text>
              <Ionicons name="star" size={16} color="white" />
            </View>
            <Text style={{ color: "#666" }}>({shop.reviews} reviews)</Text>
          </View>

          <Text style={{ color: "#666", fontSize: 16 }}>
            {(shop.categories ?? []).join(" • ")}
          </Text>

          <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
            <MaterialIcons name="location-on" size={20} color="#666" />
            <Text style={{ color: "#666", flex: 1 }}>
              {shop.location} • {shop.distance}
            </Text>
          </View>

          <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
            <Ionicons name="time-outline" size={20} color="#666" />
            <Text style={{ color: "#666" }}>{shop.timeRange}</Text>
          </View>

          {shop.freeDelivery && (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 4,
                backgroundColor: "#f0e6ff",
                padding: 12,
                borderRadius: 8,
              }}
            >
              <MaterialIcons name="delivery-dining" size={20} color="#8424FF" />
              <Text style={{ color: "#8424FF", fontWeight: "600" }}>
                FREE DELIVERY
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
