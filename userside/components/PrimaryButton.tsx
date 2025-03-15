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
        isPrimary ? "bg-blue-500" : "bg-black"
      } py-4 rounded-full mb-4 flex items-center justify-center`}
      onPress={handlePress}
      disabled={loading || isLoading}
      {...props}
    >
      {loading || isLoading ? (
        <ActivityIndicator color="white" />
      ) : (
        <Text className="text-white text-center font-bold text-base">{title}</Text>
      )}
    </TouchableOpacity>
  );
};

export default PrimaryButton;
