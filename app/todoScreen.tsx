// TodoScreen.tsx
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Button,
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type Todo = {
  id: number;
  title: string;
  completed: boolean;
};

export const TodoScreen = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [input, setInput] = useState("");

  const fetchTodos = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("https://api.example.com/todos");
      const data = await res.json();
      setTodos(data);
    } catch {
      setError("Failed to load todos");
    } finally {
      setLoading(false);
    }
  };

  const addTodo = () => {
    if (!input.trim()) return;

    const newTodo: Todo = {
      id: Date.now(),
      title: input,
      completed: false,
    };

    setTodos((prev) => [newTodo, ...prev]);
    setInput("");
  };

  const toggleTodo = (id: number) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  if (loading) return <ActivityIndicator testID="loader" />;

  if (error)
    return (
      <View>
        <Text>{error}</Text>
        <Button title="Retry" onPress={fetchTodos} />
      </View>
    );

  return (
    <View>
      <TextInput
        placeholder="Add todo"
        value={input}
        onChangeText={setInput}
        testID="input"
      />
      <Button title="Add" onPress={addTodo} />

      <FlatList
        testID="list"
        data={todos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => toggleTodo(item.id)}
            testID={`todo-${item.id}`}
          >
            <Text>
              {item.title} {item.completed ? "✅" : ""}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};
