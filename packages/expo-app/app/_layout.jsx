import { Stack, useRouter } from "expo-router";
import "react-native-reanimated";

import { AuthProvider, useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
import { View, ActivityIndicator } from "react-native"; // Import ActivityIndicator

function RootLayoutNav() {
  const { userToken, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Only run navigation logic when we are NOT loading
    if (!isLoading) {
      if (userToken) {
        router.replace("/(app)");
      } else {
        router.replace("/");
      }
    }
  }, [userToken, isLoading]); // Add isLoading to the dependency array

  // If we are loading, show a simple loading spinner and nothing else.
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  return (
    // This Stack navigator controls all the possible screens.
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="login"
        options={{ presentation: "modal", title: "Log In" }}
      />
      <Stack.Screen
        name="signup"
        options={{ presentation: "modal", title: "Sign Up" }}
      />
      {/* This line makes the (app) group available to the navigator */}
      <Stack.Screen name="(app)" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}
