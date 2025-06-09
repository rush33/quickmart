import React from "react";
import { TextInput, TouchableOpacity, View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SearchProps } from "@/types/search";

const Search = ({
  autoFocus,
  value,
  onChangeText,
  onSubmitEditing,
  fake = false,
  placeholder = "Search for 'Cake'",
}: SearchProps) => {
  return (
    <View className="px-4 py-2">
      <View className="flex-row items-center bg-neutral-100 p-3 rounded-xl space-x-2">
        <Ionicons name="search" size={20} color="#666" className="mr-2" />
        {fake ? (
          <Text className="flex-1 text-base text-neutral-400">
            {placeholder}
          </Text>
        ) : (
          <TextInput
            placeholder={placeholder}
            className="flex-1 text-base"
            autoFocus={autoFocus}
            value={value}
            onChangeText={onChangeText}
            onSubmitEditing={onSubmitEditing}
          />
        )}
        <TouchableOpacity>
          <Ionicons name="mic" size={20} color="#FF4D00" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Search;
