// app/index.tsx

// We import useEffect and useState from the 'react' library.
import { useEffect, useState } from "react";
// We import the basic components we need from 'react-native'.
import { StyleSheet, Text, View } from "react-native";

export default function App() {
  // Here we create our state variable.
  // 'healthStatus' holds the data. 'setHealthStatus' is the function we use to update it.
  // We give it a default value of 'Checking server status...'.
  const [healthStatus, setHealthStatus] = useState("Checking server status...");

  // This useEffect hook will run its code once, right after the component first renders.
  useEffect(() => {
    // This is the address of our backend server.
    // 'YOUR_COMPUTER_IP' is a placeholder we'll replace in the next step.
    const serverUrl = "http://192.168.0.28:3000/health";
    
    // 'fetch' is the command to make a network request.
    fetch(serverUrl)
      .then((response) => response.json()) // We expect a JSON response, so we parse it.
      .then((data) => setHealthStatus(data.status)) // We take the 'status' field from the data and update our state.
      .catch((error) => {
        // If anything goes wrong (e.g., can't connect), we update the state with an error message.
        console.error(error);
        setHealthStatus("Could not connect to server.");
      });
  }, []); // The empty array [] at the end means "only run this effect once".

  // The component renders a View with a Text element inside.
  // The Text element displays whatever is currently in our 'healthStatus' state variable.
  return (
    <View style={styles.container}>
      <Text>Server Status:</Text>
      <Text style={styles.statusText}>{healthStatus}</Text>
    </View>
  );
}

// These are just some basic styles for our components.
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  statusText: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 10,
  },
});
