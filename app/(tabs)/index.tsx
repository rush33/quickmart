import { SafeAreaView, StatusBar, ScrollView } from "react-native";
import Header from "../../components/Header";
import ShopCard from "../../components/ShopCard";
import "../../global.css";

// Static data for shops
const shops = [
  {
    id: 1,
    name: "Trishna Shop",
    image: "https://i.postimg.cc/qvhzT8XP/pastry.jpg",
    rating: 4.4,
    reviews: "1.8K",
    timeRange: "20-25 mins",
    categories: ["Pizzas", "Italian", "Pastas", "Desserts"],
    location: "Assam Trunk Road",
    distance: "2.8 km",
    freeDelivery: true,
  },
  {
    id: 2,
    name: "Urban Mart",
    image: "https://i.postimg.cc/qvhzT8XP/pastry.jpg",
    rating: 4.5,
    reviews: "2.1K",
    timeRange: "35-40 mins",
    categories: ["Chinese", "Continental", "Biryani"],
    location: "Convoy Road",
    distance: "1.4 km",
    freeDelivery: true,
  },
  // Add more restaurant data as needed
];

export default function Index() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <Header />

      {/* Restaurant List */}
      <ScrollView className="flex-1">
        {shops.map((shop) => (
          <ShopCard key={shop.id} shop={shop} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
