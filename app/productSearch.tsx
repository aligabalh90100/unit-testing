// app/productSearch.tsx
import React, { useState } from "react";
import { ActivityIndicator, Button, Text, TextInput, View } from "react-native";
import { createMMKV } from "react-native-mmkv";

const storage = createMMKV();

export default function ProductSearch() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState<any>(null);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!query) {
      setError("Please enter a product name");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await fetch(`https://fakestoreapi.com/products/1/`);
      const data = await res.json();

      setProduct(data);
      storage.set("lastProduct", JSON.stringify(data));
    } catch (e) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View>
      <TextInput
        testID="search-input"
        placeholder="Search product"
        value={query}
        onChangeText={setQuery}
      />

      <Button title="Search" onPress={handleSearch} />

      {loading && <ActivityIndicator testID="loader" />}

      {error ? <Text testID="error">{error}</Text> : null}

      {product && (
        <View>
          <Text testID="product-title">{product.title}</Text>
          <Text testID="product-price">${product.price}</Text>
        </View>
      )}
    </View>
  );
}
