// hooks/useUserSearch.ts
import { searchUsers } from "@/api/users";
import { useEffect, useRef, useState } from "react";
import { createMMKV } from "react-native-mmkv";

const storage = createMMKV();

type User = {
  id: number;
  name: string;
};

export function useUserSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 🔥 used for race condition
  const requestIdRef = useRef(0);

  // 🔁 retry support
  const lastQueryRef = useRef("");

  const fetchUsers = async (q: string) => {
    if (!q) {
      setResults([]);
      return;
    }

    lastQueryRef.current = q;

    // 🔥 check cache first
    const cached = storage.getString(`users-${q}`);
    if (cached) {
      setResults(JSON.parse(cached));
      return;
    }

    const currentId = ++requestIdRef.current;

    setLoading(true);
    setError("");

    try {
      const data = await searchUsers(q);

      // 🔥 ignore stale responses
      if (currentId !== requestIdRef.current) return;

      setResults(data);

      // 💾 cache result
      storage.set(`users-${q}`, JSON.stringify(data));
    } catch (err) {
      if (currentId !== requestIdRef.current) return;

      setError(err instanceof Error ? err.message : "Error");
    } finally {
      if (currentId === requestIdRef.current) {
        setLoading(false);
      }
    }
  };

  // ⏱ debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers(query);
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  const retry = () => {
    fetchUsers(lastQueryRef.current);
  };

  const clear = () => {
    setQuery("");
    setResults([]);
    setError("");
  };

  return {
    query,
    setQuery,
    results,
    loading,
    error,
    retry,
    clear,
  };
}
