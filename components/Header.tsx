import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";

const Header = () => {
  return (
    <View style={{ padding: 16, gap: 8 }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <MaterialIcons name="location-on" size={24} color="#FF4D00" />
          <View>
            <Text style={{ fontSize: 18, fontWeight: "600" }}>
              Podum Nagar 2
            </Text>
            <Text style={{ color: "#666" }}>
              Podum Nagar 2, Dibrugarh, Assam 786622, India
            </Text>
          </View>
        </View>
      </View>

      {/* Search Bar */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: "#f5f5f5",
          padding: 12,
          borderRadius: 12,
          gap: 8,
        }}
      >
        <Ionicons name="search" size={20} color="#666" />
        <TextInput placeholder="Search for 'Cake'" style={{ flex: 1 }} />
        <TouchableOpacity>
          <Ionicons name="mic" size={20} color="#FF4D00" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Header;

// Tailwind CSS
// import { Ionicons, MaterialIcons } from "@expo/vector-icons";
// import React from "react";
// import { View, Text, TextInput, TouchableOpacity } from "react-native";

// const Header = () => {
//   return (
//     <View className="p-4 space-y-2">
//       <View className="flex-row items-center justify-between">
//         <View className="flex-row items-center space-x-2">
//           <MaterialIcons name="location-on" size={24} color="#FF4D00" />
//           <View>
//             <Text className="text-base font-semibold">Podum Nagar 2</Text>
//             <Text className="text-gray-500">
//               Podum Nagar 2, Dibrugarh, Assam 786622, India
//             </Text>
//           </View>
//         </View>
//       </View>

//       {/* Search Bar */}
//       <View className="flex-row items-center bg-gray-200 p-3 rounded-lg space-x-2">
//         <Ionicons name="search" size={20} color="#666" />
//         <TextInput
//           placeholder="Search for 'Cake'"
//           className="flex-1 text-sm text-black"
//         />
//         <TouchableOpacity>
//           <Ionicons name="mic" size={20} color="#FF4D00" />
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// export default Header;
