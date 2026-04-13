import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack initialRouteName="productsScreen">
      <Stack.Screen name="index" />
      <Stack.Screen name="loginScreen" />
      <Stack.Screen name="productsScreen" />
      <Stack.Screen name="productDetails" />
      <Stack.Screen name="productSearch" />
      <Stack.Screen name="tipCalculator" />
    </Stack>
  );
}
