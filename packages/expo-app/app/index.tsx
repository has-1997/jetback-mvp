import { View, Text, StyleSheet } from "react-native";
import { Link } from "expo-router";

export default function WelcomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Jetback</Text>
      <Text style={styles.subtitle}>Your personal flight price tracker.</Text>

      <View style={styles.buttonContainer}>
        <Link href="/login" style={styles.button}>
          <Text style={styles.buttonText}>Log In</Text>
        </Link>
        <Link href="/signup" style={[styles.button, styles.buttonOutline]}>
          <Text style={styles.buttonOutlineText}>Sign Up</Text>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: "#666",
    marginBottom: 40,
  },
  buttonContainer: {
    width: "80%",
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  buttonOutline: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "#007AFF",
  },
  buttonOutlineText: {
    color: "#007AFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
