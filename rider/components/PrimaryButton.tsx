import React, { useState } from "react";
import {
  Text,
  ActivityIndicator,
  TouchableOpacityProps,
  Pressable,
} from "react-native";

type PrimaryButtonProps = TouchableOpacityProps & {
  title: string;
  loading: boolean;
  isPrimary: boolean;
  onPressFunction: () => Promise<void> | void;
};

const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  title,
  loading = false,
  isPrimary = false,
  onPressFunction,
  ...props
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handlePress = async () => {
    if (loading || isLoading) return;
    if (onPressFunction) {
      try {
        setIsLoading(true);
        await onPressFunction();
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <Pressable
      className={`${
        isPrimary
          ? "hover:bg-green-500 active:bg-green-400 bg-green-500 border-green-500"
          : "bg-gray-500"
      } 
       w-full items-center p-3 rounded-2xl  duration-150 border-2 mb-2
      `}
      onPress={handlePress}
      disabled={loading || isLoading}
      {...props}
    >
      {loading || isLoading ? (
        <ActivityIndicator color="white" />
      ) : (
        <Text
          className={`text-center ${
            isPrimary ? "text-gray-50" : "text-gray-50"
          } font-extrabold text-xl`}
        >
          {title}
        </Text>
      )}
    </Pressable>
  );
};

export default PrimaryButton;
