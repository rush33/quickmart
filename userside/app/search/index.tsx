import React, { useEffect, useState } from "react";
import { TextInput, TouchableOpacity, View, Text } from "react-native";
import Search from "@/components/Search";
import { db, searchData } from "@/utils/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

const SearchScreen = () => {
  const [searchValue, setSearchValue] = useState("");

  const handleSearch = async () => {
    try {
      console.log("Search initiated");
      const q = query(collection(db, "items"), where("name", "==", "Frozen Prawns"));
      console.log("q initiated");
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        console.log("No matching documents found.");
        return;
      }

      querySnapshot.forEach((doc) => {
        console.log(doc.id, " => ", doc.data());
      });
    } catch (error) {
      console.error("Error searching:", error);
      throw error;
    }
  };

  useEffect(() => {
    handleSearch();
  }, []);

  return (
    <View className="mt-2 px-1 py-3">
      <Search
        onChangeText={(text) => setSearchValue(text)}
        value={searchValue}
        autoFocus
        onSubmitEditing={handleSearch}
      />
    </View>
  );
};

export default SearchScreen;
