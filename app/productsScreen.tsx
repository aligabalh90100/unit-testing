// app/products.tsx
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Button, FlatList, Text, View } from "react-native";

export default function Products() {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/posts")
      .then((res) => res.json())
      .then((data) => setProducts(data.slice(0, 3)))
      .catch((e) => console.log(e));
  }, []);

  return (
    <FlatList
      testID="products-list"
      data={products}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <View>
          <Text>{item.title}</Text>
          <Button
            title="View Details"
            onPress={() =>
              router.push({
                pathname: "/productDetails",
                params: { id: item.id, title: item.title },
              })
            }
          />
        </View>
      )}
    />
  );
}
