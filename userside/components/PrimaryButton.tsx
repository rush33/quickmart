import React, { useState } from "react";
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  TouchableOpacityProps,
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
    <TouchableOpacity
      className={`${
        isPrimary
          ? "hover:bg-green-200 active:bg-green-400 bg-green-300 border-green-600"
          : "bg-gray-500"
      } 
      mx-auto w-full items-center p-2 rounded-2xl  duration-150 border-l-4 border-b-4 
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
            isPrimary ? "text-gray-700" : "text-white"
          } font-extrabold text-xl`}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default PrimaryButton;
