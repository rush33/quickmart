import React, { useState } from "react";
import { View, TextInput, Button, Text, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/context/AuthContext";

export default function SignupScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { SignUp } = useAuth();

  const handleSignup = async () => {
    try {
      setLoading(true);
      let res = await SignUp(email, password);
      setLoading(false);
      console.log("res in signup", res);
      if (!res.success) {
        Alert.alert("Sign Up", res.msg);
      }
      // router.push("/(tabs)");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 16 }}>
      <Text>Signup</Text>
      {error ? <Text style={{ color: "red" }}>{error}</Text> : null}
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={{ marginVertical: 8, borderWidth: 1, padding: 8 }}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ marginVertical: 8, borderWidth: 1, padding: 8 }}
      />
      <Button title="Signup" onPress={handleSignup} />
      <Button
        title="Go to Login"
        onPress={() => router.push("/(auth)/Login")}
      />
    </View>
  );
}
