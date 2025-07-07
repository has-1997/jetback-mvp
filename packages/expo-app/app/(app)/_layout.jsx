import { Link, Stack } from "expo-router";
import { Pressable, Text } from "react-native";

// This is the layout for the "main" app screens.
export default function AppLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Dashboard",
          // Add a button to the right side of the header
          headerRight: () => (
            // asChild prop lets the Link component pass its press handling
            // down to our custom Pressable component.
            <Link href="/instructions" asChild>
              <Pressable>
                {/* A simple text button */}
                <Text style={{ color: "#007AFF", fontSize: 16 }}>
                  Add Flight
                </Text>
              </Pressable>
            </Link>
          ),
        }}
      />
      <Stack.Screen name="flights/[id]" options={{ title: "Flight Details" }} />
      <Stack.Screen name="instructions" options={{ title: "Instructions" }} />
    </Stack>
  );
}
