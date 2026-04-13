// app/productDetails.tsx
import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";

export default function ProductDetails() {
  const { id, title } = useLocalSearchParams();

  return (
    <View>
      <Text testID="details-id">ID: {id}</Text>
      <Text testID="details-title">{title}</Text>
    </View>
  );
}
