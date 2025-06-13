import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { useRouter } from "expo-router";

const StartPage = () => {
  // const router = useRouter();

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     router.replace("/(auth)/Signup");
  //   }, 2000); 

  //   return () => clearTimeout(timer); 
  // }, []);

  return (
    <View className="flex-1 justify-center items-center">
      <ActivityIndicator size="large" color="gray" />
    </View>
  );
};

export default StartPage;
