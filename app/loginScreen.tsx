// app/login.tsx
import React, { useState } from "react";
import { ActivityIndicator, Button, Text, TextInput, View } from "react-native";
import { createMMKV } from "react-native-mmkv";

const storage = createMMKV();

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      setError("All fields are required");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await fetch("https://jsonplaceholder.typicode.com/users/1");
      const data = await res.json();

      storage.set("user", JSON.stringify(data));
    } catch (e) {
      setError("Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View>
      <TextInput
        testID="email-input"
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        testID="password-input"
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
      />

      <Button title="Login" onPress={handleLogin} />

      {loading && <ActivityIndicator testID="loader" />}

      {error ? <Text testID="error">{error}</Text> : null}
    </View>
  );
}
