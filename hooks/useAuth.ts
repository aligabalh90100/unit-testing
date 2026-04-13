// hooks/useAuth.ts
import { useState } from "react";
import { createMMKV } from "react-native-mmkv";

const storage = createMMKV();

type User = {
  token: string;
  name: string;
};

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string) => {
    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("https://api.example.com/login");

      if (!res.ok) {
        throw new Error("Invalid credentials");
      }

      const data = await res.json();

      const userData: User = {
        token: data.token,
        name: data.name,
      };

      // save to storage
      storage.set("user", JSON.stringify(userData));

      setUser(userData);
    } catch (err) {
      setError("Login failed");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    storage.remove("user");
    setUser(null);
  };

  return {
    login,
    logout,
    loading,
    error,
    user,
  };
}
