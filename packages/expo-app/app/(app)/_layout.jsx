import { Stack } from "expo-router";

// This is the layout for the "main" app screens.
export default function AppLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Dashboard" }} />
    </Stack>
  );
}
