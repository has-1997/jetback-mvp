import React from "react";
import { View, Text, StyleSheet, Pressable, Alert } from "react-native";
import { Stack } from "expo-router";
import { jwtDecode } from "jwt-decode";
import * as Clipboard from "expo-clipboard";
import { useAuth } from "@/context/AuthContext";

export default function InstructionsScreen() {
  const { userToken } = useAuth();
  let userEmailAddress = "Loading...";

  if (userToken) {
    // Decode the token to get the user's unique ID (uid)
    const decodedToken = jwtDecode(userToken);
    // Construct the unique email address
    userEmailAddress = `${decodedToken.uid}@track.jetbackmvp.com`;
  }

  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(userEmailAddress);
    Alert.alert(
      "Copied!",
      "Your unique email address has been copied to the clipboard."
    );
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "How to Add a Flight" }} />
      <Text style={styles.title}>Forward Your Bookings</Text>
      <Text style={styles.description}>
        To start tracking a flight, simply forward your airline booking
        confirmation email to the unique address below. Our system will
        automatically parse it and add it to your dashboard.
      </Text>

      <View style={styles.emailContainer}>
        <Text style={styles.emailText}>{userEmailAddress}</Text>
      </View>

      <Pressable style={styles.button} onPress={copyToClipboard}>
        <Text style={styles.buttonText}>Copy Email</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: "#333",
    lineHeight: 24,
    marginBottom: 30,
  },
  emailContainer: {
    backgroundColor: "#f0f0f0",
    padding: 20,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  emailText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#007AFF",
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
