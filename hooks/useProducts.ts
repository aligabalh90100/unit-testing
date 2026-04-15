// hooks/useProducts.ts
import { useEffect, useState } from "react";
import { createMMKV } from "react-native-mmkv";

const storage = createMMKV();

type Product = {
  id: number;
  title: string;
};

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchProducts = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("https://api.example.com/products");

      if (!res.ok) throw new Error("Failed");

      const data = await res.json();

      setProducts(data);

      // cache data
      storage.set("products", JSON.stringify(data));
    } catch (e) {
      setError("Failed to fetch products");

      // try fallback from cache
      const cached = storage.getString("products");
      if (cached) {
        setProducts(JSON.parse(cached));
      }
    } finally {
      setLoading(false);
    }
  };

  const clearProducts = () => {
    setProducts([]);
    storage.remove("products");
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    products,
    loading,
    error,
    fetchProducts,
    clearProducts,
  };
}
