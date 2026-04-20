import { login as loginApi } from "@/api/auth";
import { useState } from "react";
import { createMMKV } from "react-native-mmkv";

const storage = createMMKV();

type User = {
  token: string;
  name: string;
};

export function useAuthApi() {
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
      const data = await loginApi<{ token: string; name: string }>(
        email,
        password,
      );

      const userData: User = {
        token: data.token,
        name: data.name,
      };

      storage.set("user", JSON.stringify(userData));
      setUser(userData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
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
