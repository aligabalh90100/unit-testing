import { searchProducts } from "@/api/productsAdvanced";
import { useEffect, useRef, useState } from "react";
import { createMMKV } from "react-native-mmkv";

const storage = createMMKV();

export function useSearchProducts() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const requestIdRef = useRef(0);
  const lastQueryRef = useRef("");

  const fetchProducts = async (searchQuery: string) => {
    if (!searchQuery) return;

    const currentRequestId = ++requestIdRef.current;

    setLoading(true);
    setError("");

    try {
      // ✅ cache check
      const cached = storage.getString(searchQuery);
      if (cached) {
        setResults(JSON.parse(cached));
        setLoading(false);
        return;
      }

      const data = await searchProducts(searchQuery);

      // ✅ prevent race condition
      if (currentRequestId !== requestIdRef.current) return;

      storage.set(searchQuery, JSON.stringify(data));
      setResults(data);
    } catch (err) {
      if (currentRequestId !== requestIdRef.current) return;

      setError(err instanceof Error ? err.message : "Search failed");
    } finally {
      if (currentRequestId === requestIdRef.current) {
        setLoading(false);
      }
    }
  };

  // ✅ debounce effect
  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      lastQueryRef.current = query;
      fetchProducts(query);
    }, 500);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [query]);

  const retry = () => {
    fetchProducts(lastQueryRef.current);
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
