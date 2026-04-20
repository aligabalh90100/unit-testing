import { useUserSearch } from "@/hooks/useUserSearch";
import { Button, Text, TextInput, View } from "react-native";

export default function UserSearchScreen() {
  const { query, setQuery, results, loading, error, retry } = useUserSearch();

  return (
    <View>
      <TextInput
        testID="search-input"
        value={query}
        onChangeText={setQuery}
        placeholder="Search users..."
      />

      {loading && <Text testID="loader">Loading...</Text>}

      {error && (
        <>
          <Text testID="error">{error}</Text>
          <Button title="Retry" onPress={retry} />
        </>
      )}

      {results.map((user) => (
        <Text key={user.id} testID="user-item">
          {user.name}
        </Text>
      ))}
    </View>
  );
}
