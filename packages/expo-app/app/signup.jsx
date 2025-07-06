import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { useAuth } from "../context/AuthContext";
import { signUpUser } from "../api/api";
import { useRouter } from "expo-router";

export default function SignUpScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { signIn } = useAuth();
  const router = useRouter();

  const handleSignUp = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password.");
      return;
    }
    setIsLoading(true);
    try {
      const data = await signUpUser(email, password);
      // The API call was successful, now sign in the user in our context
      signIn(data.token);
      // After signing in, we can dismiss the modal or navigate away.
      // For now, let's just show a success message. The redirection will be handled next.
      Alert.alert("Success", "Account created successfully!");
      // We'll replace the alert with navigation soon.
    } catch (error) {
      Alert.alert("Sign Up Failed", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button
        title={isLoading ? "Creating Account..." : "Sign Up"}
        onPress={handleSignUp}
        disabled={isLoading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
});
