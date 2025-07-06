import { View, Text, StyleSheet } from "react-native";
import { useAuth } from "../../context/AuthContext";

export default function DashboardScreen() {
  const { userToken } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>
      <Text>Welcome! You are logged in.</Text>
      {/* We can even display a snippet of the token to prove it's working */}
      <Text style={styles.token}>Token: {userToken.substring(0, 30)}...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  token: {
    marginTop: 10,
    fontSize: 10,
    color: "gray",
    paddingHorizontal: 20,
  },
});
