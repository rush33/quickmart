import { useState } from "react";
import { View, TextInput, Button, Text, Alert } from "react-native";
import { auth } from "../../utils/firebaseConfig";
import { useRouter } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import React from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { SignIn } = useAuth();

  const handleSignIn = async () => {
    try {
      setLoading(true);
      const res = await SignIn(email, password);
      if (!res.success) {
        Alert.alert("Sign In", res.msg);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 16 }}>
      <Text>Login</Text>
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
      <Button title="Login" onPress={handleSignIn} />
      <Button
        title="Go to Signup"
        onPress={() => router.push("/(auth)/Signup")}
      />
    </View>
  );
}
