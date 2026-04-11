import { useMemo, useState } from "react";
import { Text, TextInput, View } from "react-native";
import { createMMKV } from "react-native-mmkv";
export const storage = createMMKV();

export default function Index() {
  const [price, setPrice] = useState("");
  const [code, setCode] = useState("");

  const discountRegex = /^SAVE\d+$/i;

  const result = useMemo(() => {
    const numPrice = parseFloat(price);

    if (!price) return { error: null, value: 0 };
    if (isNaN(Number(price))) return { error: "Invalid Price", value: null };

    const match = discountRegex.test(code.toLowerCase());

    if (match) {
      const discountPercentage = parseFloat(code.split(/save/i)[1]);
      if (!discountPercentage) return { value: numPrice / 100, error: null };
      if (discountPercentage > 90) {
        return { error: "Save code can't be more than 90", value: null };
      }

      const discountAmount = (numPrice * discountPercentage) / 100;
      return { error: null, value: numPrice - discountAmount };
    }

    // No discount applied
    return { error: null, value: numPrice };
  }, [price, code]);
  return (
    <View>
      <TextInput
        placeholder="Enter Price"
        onChangeText={setPrice}
        keyboardType="numeric"
        testID="price"
      />
      <TextInput
        placeholder="Discount Code"
        onChangeText={setCode}
        testID="code"
      />
      {/* Display result or error here */}
      {result.error ? (
        <Text style={{ color: "red" }}>{result.error}</Text>
      ) : (
        <Text testID="final-price">Final Price: {result.value}</Text>
      )}
    </View>
  );
}
