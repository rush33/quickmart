import {
  SafeAreaView,
  StatusBar,
  View,
  Text,
  Image,
  FlatList,
} from "react-native";
import Header from "../../components/Header";
import ShopCard from "../../components/ShopCard";
import "../../global.css";
import { useEffect, useState } from "react";
import { fetchData } from "../../utils/firebaseConfig";
import { Shop } from "@/types/shop";

// Static data for category sections
const categories = [
  {
    title: "Grocery & Kitchen",
    items: [
      {
        name: "Fruits & Vegetables",
        image:
          "https://media-hosting.imagekit.io//3c8ef0a2bef44113/istockphoto-1284690585-612x612.jpg?Expires=1836827884&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=QYrR0LDkYugNmoQwj5-GmMxGCiGoh6GwTuegeD-wPokVpQ4li77Ppkyz7dStmL7si0Zk1skgubY10zNjonjQ2rr2XoG71YnIrXcDyDNgWGTo4vHRgepDy-VDVntAvfSXAz9sKmbC5W0p-4PvUcmmbcwZar7Hen-0g7xdIC0z1rUWUSyUsNQfIvE~QOBmgINBa8ZXFlr1zUvQoToCmwctodXhumU7zT9IFcTDRynh76HnA3BMVVsvAlSLej-0xw1YJxA81vqzQWjy3r5dBV-zVinuts4IfR5PILx8KfGtEp1S5C7mFBE9FtMrEnLJgwnYLNiVBF07rj6vwh6E~mBMTw__",
      },
      {
        name: "Dairy, Bread & Eggs",
        image:
          "https://media-hosting.imagekit.io//cf2cb61303274276/istockphoto-1363070690-612x612.jpg?Expires=1836828416&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=aRsXziIzsXf2g~P7hEI9g-ow-~vqP14tXI3HLpsSnb5U4DzZp6VrJdrVe-1amB-6ek0JGvHNodR2JG4JR7hd5E8TZkqAMCgu7FksfNfs2xLPWpFRSYH~KDpbohch85OFFGo4bWaAH04BSGtaKngnrQ2cCZWhLDaM2LrXHMpJUEQhgiThvrNLiPVfeI0sTPHGKz3a~Q3XAheUReMBnyvnMLYcX6dkGL9125UDYcbmHFAfwtyvdSSprguSeADhx0o9NKGIa7b4mfXaJsLz0lFLL4JfHyDHtak7Lvcm-HXu8vX-8E-1iUqpc2E6LTxtxeSueKFeA1XqLyhFjjivmkvi1Q__",
      },
      {
        name: "Atta, Rice, Oil & Dals",
        image:
          "https://media-hosting.imagekit.io//0427bf7409f54e01/FLOURRICE-20200819-153805.webp?Expires=1836828544&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=VeKN78dZdJoIvjXeDtT-Y05J1NVdxWXu0~PzbczftlTminXI~2CfWTgZH2GZRTt~zN0M4HmH0BqcRmrL9Tofe7-6yy4Ge9~0tUJiub4FlcXFlvb002g6vt5teGG5GclDeffLIfgZqe6pUdbZusVfhhe8nKNr0f1BW9DgWx2dmpiFhuxyxqFN81W~gZJWI-18-YeUk5myuowQ9Mnd3TmU4PVYZcpf-YklrcEhrhBdW6x8bUtL5lREXkvz9PQeChmx06y0QVITze0pTo~lFaSUr2Em18aJTv7lvQ-n51FQsES7pjoSazwCC4oXMQnitZFriPv7Rg45ZAEOw7BaFzPaTQ__",
      },
      {
        name: "Meat, Fish & Eggs",
        image:
          "https://media-hosting.imagekit.io//8d4ccc30b8e84390/depositphotos_79046312-stock-photo-close-up-of-different-food.jpg?Expires=1836828631&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=Sokx9S3KUSrdHixCvKvVB7PyheIRsTAAISiCDNa0I-13s7cYqSyL9tyJ-hFdMbrDMnPsN2NjYQFJkeaEyp06WOjCR8MoIiYi~nmjswhBR1jsF7yFwJndMfnIpSHTc5ib-oQhMhGWKIRpBI~bRV976EhkGWdjhMXrn8WtdxWXTT2rvhHKVSCIa9DBdcj4R4iYADiKYGVG1BufN9Dy3kziXFHrkLBeH4LFn9dZr2~y4bEJ7YU~jM964DU0FIXVi8osLi7CNzvttzkyjiXW7Ra-jy9WaaPKkjquGsNFLSWBji3iQXXGBnaPd2h1r8V1Tsw~M1NFCFTqgP0ybMyJnxnD1g__",
      },
      {
        name: "Masala & Dry Fruits",
        image:
          "https://media-hosting.imagekit.io//4a860cb25f09404c/91vqN50vrLS._AC_UF1000,1000_QL80_.jpg?Expires=1836828715&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=UdytkRqryHsmuzhxBDmB0WgCSq9xFb2DfFmRd3a6qX6l--lVd7livCNeT3Itu7-1QowbztRb4qUk3YtWveBVmACOLPfHJ3w1EoENtlkjKMIjxi0I5zMW-CDlE48V1K659IMyb6wcz7T9aLVWARBVfHt3Gkw0nd87k4gZW8gTi7BBGV00CQgupAYMeetakZ7QUH-6gBDku8A2TIHLVDdZcKPBICCYdEBWL7nnCil0VULWPkW1L~XIsePt7WrcIYAoeM4w-70lFR7EP0D4qH7hhEfZnooD4wIf8-hVt0QkquKe~YkvOPFi7n4BvuYONTnkeQhJn8jUgVCezeuHrc8uZA__",
      },
      {
        name: "Breakfast & Sauces",
        image:
          "https://media-hosting.imagekit.io//c19aac5961544060/Breakfast-cereals-mobile.webp?Expires=1836828806&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=Gh3qdn7ffOZRRouf~0562faaHA7222QA0lHFddnvPxMZXFzSMENVQJ4lgh1worAKW~mgEEIHbmn-wKckBaL6iyLWaErkhvuGUgWGo7nHqvQXtsfaaXpXOb9Ai6O260yTlWFqpFLYZem9~JJEVDFrlUH1EG2kcNKcgxZBGKoEbIDjzVSQnBrL3v7LMLb1GdCKOSNC56Uxn3nt9mx8oWo7iTtGE676omuydd3SDC5K-UFcj509ARLFZz0TcERjt9gBA9WUwCmdE3RRuR788JoExcMYIL7WLKQZgq3tl3Ipu89tkNisTWxM4ibwU0KdMbJTu6ho9IAV36ciOHBxuii5PA__",
      },
    ],
  },
  {
    title: "Snacks & Drinks",
    items: [
      {
        name: "Ice Creams & More",
        image:
          "https://ik.imagekit.io/jtfemdkjq/71ku+fYqReL._AC_UF350,350_QL80_.jpg?updatedAt=1742221093772",
      },
      {
        name: "Cold Drinks & Juices",
        image:
          "https://ik.imagekit.io/jtfemdkjq/coca-cola.jpg?updatedAt=1742221273190",
      },
      {
        name: "Snacks",
        image:
          "https://ik.imagekit.io/jtfemdkjq/poznan-poland-oct-packets-lay-s-potato-chips-popular-american-brand-founded-owned-pepsico-packets-lays-105763625.webp?updatedAt=1742221430386",
      },
      {
        name: "Biscuits & Cookies",
        image:
          "https://ik.imagekit.io/jtfemdkjq/cookies-versus-biscuits-e1528207091843.jpg?updatedAt=1742221525191",
      },
    ],
  },
];

export default function Index() {
  const [shopData, setShopData] = useState<Shop[]>([]);

  useEffect(() => {
    const loadShops = async () => {
      try {
        const shopsData = (await fetchData("shops")) as any[];
        const typedShops = shopsData.map((shop) => ({
          id: shop.id,
          name: shop.name || "",
          image: shop.image || "",
          rating: Number(shop.rating) || 0,
          address: shop.address || "",
          genre: Array.isArray(shop.genre) ? shop.genre : [],
          lat: Number(shop.lat) || 0,
          lng: Number(shop.lng) || 0,
        }));
        setShopData(typedShops);
        // console.log("Shops from Firestore:", typedShops);
      } catch (error) {
        console.error("Error loading shops:", error);
      }
    };

    loadShops();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="default" />
      <Header />

      {/* Main Content */}
      <FlatList
        data={[...categories]}
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
                  <Image
                    source={{ uri: subItem.image }}
                    className="w-24 h-24 rounded-lg"
                  />
                  <Text className="text-xs text-center mt-1">
                    {subItem.name}
                  </Text>
                </View>
              )}
            />
          </View>
        )}
        ListFooterComponent={
          <View className="px-4">
            {shopData.map((shop) => (
              <ShopCard key={shop.id} shop={shop} />
            ))}
          </View>
        }
      />
    </SafeAreaView>
  );
}
