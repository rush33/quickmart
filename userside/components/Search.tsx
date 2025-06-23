import React from "react";
import { TextInput, TouchableOpacity, View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SearchProps } from "@/types/search";

interface UpdatedSearchProps extends SearchProps {
  showBackButton?: boolean;
  onBackPress?: () => void;
}

const Search = ({
  autoFocus,
  value,
  onChangeText,
  onSubmitEditing,
  fake = false,
  placeholder = "Search for atta, dal, coke and more",
  showBackButton = false,
  onBackPress,
}: UpdatedSearchProps) => {
  return (
    <View className="px-4 py-2">
      <View className="flex-row items-center border border-gray-100 bg-white rounded-2xl pl-4 pr-4 py-3 space-x-3 shadow-sm">
        {showBackButton && (
          <TouchableOpacity onPress={onBackPress}>
            <Ionicons name="arrow-back" size={20} color="#666" className="mr-2" />
          </TouchableOpacity>
        )}
        {fake ? (
          <Text className="flex-1 text-sm text-neutral-400">{placeholder}</Text>
        ) : (
          <TextInput
            cursorColor="#333333"
            placeholder={placeholder}
            placeholderTextColor="#888"
            className="flex-1 text-base text-neutral-900"
            autoFocus={autoFocus}
            value={value}
            onChangeText={onChangeText}
            onSubmitEditing={onSubmitEditing}
          />
        )}
        <TouchableOpacity>
          <Ionicons name="mic" size={20} color="#333333" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Search;
