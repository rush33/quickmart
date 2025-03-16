import { SafeAreaView, StatusBar, View, Text, Image, FlatList } from "react-native";
import Header from "../../components/Header";
import ShopCard from "../../components/ShopCard";
import "../../global.css";

// Static data for category sections
const categories = [
  {
    title: "Grocery & Kitchen",
    items: [
      { name: "Fruits & Vegetables", image: "https://i.postimg.cc/qvhzT8XP/pastry.jpg" },
      { name: "Dairy, Bread & Eggs", image: "https://i.postimg.cc/qvhzT8XP/pastry.jpg" },
      { name: "Atta, Rice, Oil & Dals", image: "https://i.postimg.cc/qvhzT8XP/pastry.jpg" },
      { name: "Meat, Fish & Eggs", image: "https://i.postimg.cc/qvhzT8XP/pastry.jpg" },
      { name: "Masala & Dry Fruits", image: "https://i.postimg.cc/qvhzT8XP/pastry.jpg" },
      { name: "Breakfast & Sauces", image: "https://i.postimg.cc/qvhzT8XP/pastry.jpg" },
    ],
  },
  {
    title: "Snacks & Drinks",
    items: [
      { name: "Tea, Coffee & More", image: "https://i.postimg.cc/qvhzT8XP/pastry.jpg" },
      { name: "Ice Creams & More", image: "https://i.postimg.cc/qvhzT8XP/pastry.jpg" },
      { name: "Frozen Food", image: "https://i.postimg.cc/qvhzT8XP/pastry.jpg" },
      { name: "Sweet Cravings", image: "https://i.postimg.cc/qvhzT8XP/pastry.jpg" },
      { name: "Cold Drinks & Juices", image: "https://i.postimg.cc/qvhzT8XP/pastry.jpg" },
      { name: "Munchies", image: "https://i.postimg.cc/qvhzT8XP/pastry.jpg" },
      { name: "Biscuits & Cookies", image: "https://i.postimg.cc/qvhzT8XP/pastry.jpg" },
    ],
  },
];


// Static data for shops
const shops = [
  {
    id: 1,
    name: "Trishna Grocery",
    image: "https://i.postimg.cc/qvhzT8XP/pastry.jpg",
    rating: 4.4,
    reviews: "1.2K",
    timeRange: "15-20 mins",
    categories: ["Fruits & Vegetables", "Dairy & Eggs", "Grains & Pulses", "Spices"],
    location: "Assam Trunk Road",
    distance: "3.2 km",
    freeDelivery: true,
  },
  {
    id: 2,
    name: "Urban Fresh Mart",
    image: "https://i.postimg.cc/qvhzT8XP/pastry.jpg",
    rating: 4.6,
    reviews: "1.5K",
    timeRange: "25-30 mins",
    categories: ["Snacks", "Drinks", "Frozen Food", "Breakfast Items"],
    location: "Gar Ali",
    distance: "1.7 km",
    freeDelivery: true,
  },
];


export default function Index() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="default" />

      {/* Header with Search Bar */}
      <Header />

      {/* Main Content */}
      <FlatList
        data={[...categories]} // Using categories as the main list
        keyExtractor={(item, index) => `category-${index}`}
        renderItem={({ item }) => (
          <View className="mb-4 px-4">
            <Text className="text-lg font-bold mb-2">{item.title}</Text>
            <FlatList
              data={item.items}
              numColumns={3}
              keyExtractor={(subItem, idx) => `${item.title}-${idx}`}
              renderItem={({ item: subItem }) => (
                <View className="w-1/3 p-2 items-center">
                  <Image source={{ uri: subItem.image }} className="w-24 h-24 rounded-lg" />
                  <Text className="text-xs text-center mt-1">{subItem.name}</Text>
                </View>
              )}
            />
          </View>
        )}
        ListFooterComponent={
          <View className="px-4">
            {shops.map((shop) => (
              <ShopCard key={shop.id} shop={shop} />
            ))}
          </View>
        }
      />
    </SafeAreaView>
  );
}
