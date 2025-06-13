import React from "react";
import { TextInput, TextInputProps } from "react-native";

interface InputBoxProps extends TextInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
}

export default function InputBox({
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  ...rest
}: InputBoxProps): JSX.Element {
  return (
    <TextInput
      className="border border-gray-300 rounded-lg p-4 mb-4"
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      secureTextEntry={secureTextEntry}
      placeholderTextColor="#666"
      {...rest}
    />
  );
}
