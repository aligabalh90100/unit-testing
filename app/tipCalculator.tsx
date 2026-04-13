import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const TipCalculator = () => {
  const [bill, setBill] = useState("");
  const [tipAmount, setTipAmount] = useState(0);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState("");

  const calculateTip = (percentage: number) => {
    const billNum = parseFloat(bill);

    if (isNaN(billNum) || billNum <= 0) {
      setError("Please enter a valid amount");
      setTipAmount(0);
      setTotal(0);
      return;
    }

    setError("");
    const calculatedTip = billNum * (percentage / 100);
    setTipAmount(calculatedTip);
    setTotal(billNum + calculatedTip);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tip Calculator</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter Bill Amount"
        keyboardType="numeric"
        value={bill}
        onChangeText={setBill}
        testID="bill-input"
      />

      {error ? (
        <Text style={styles.error} testID="error-message">
          {error}
        </Text>
      ) : null}

      <View style={styles.buttonContainer}>
        {[10, 15, 20].map((percent) => (
          <TouchableOpacity
            key={percent}
            style={styles.button}
            onPress={() => calculateTip(percent)}
            testID={`tip-btn-${percent}`}
          >
            <Text style={styles.buttonText}>{percent}%</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.resultContainer}>
        <Text style={styles.resultText}>
          Tip: <Text testID="tip-result">${tipAmount.toFixed(2)}</Text>
        </Text>
        <Text style={styles.resultText}>
          Total: <Text testID="total-result">${total.toFixed(2)}</Text>
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1, justifyContent: "center" },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  error: { color: "red", marginBottom: 10 },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 5,
    width: "30%",
  },
  buttonText: { color: "white", textAlign: "center", fontWeight: "bold" },
  resultContainer: { marginTop: 20 },
  resultText: { fontSize: 18, marginBottom: 5 },
});

export default TipCalculator;
