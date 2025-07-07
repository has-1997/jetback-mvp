import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useAuth } from "../../../context/AuthContext";
import { getFlightById } from "../../../api/api";

const data = [
  {
    status: "savings_found",
    originalPrice: 100,
    newPrice: 80,
    totalSavings: 20,
  },
];

// A new component specifically for the savings display
const SavingsDisplay = ({ flight }) => (
   
  <View style={styles.savingsContainer}>
    <Text style={styles.savingsTitle}>💰 Savings Found!</Text>
    <View style={styles.priceRow}>
      <Text style={styles.priceLabel}>Original Price:</Text>
      <Text style={styles.priceValue}>${flight.originalPrice}</Text>
    </View>
    <View style={styles.priceRow}>
      <Text style={styles.priceLabel}>New Price:</Text>
      <Text style={styles.priceValue}>${flight.newPrice}</Text>
    </View>
    <View style={styles.totalSavingsRow}>
      <Text style={styles.totalSavingsLabel}>Total Savings:</Text>
      <Text style={styles.totalSavingsValue}>${flight.totalSavings}</Text>
    </View>
    <Text style={styles.instructions}>
      To claim your savings, visit the airline's website and use their "change
      flight" feature to rebook the same flight at the lower price.
    </Text>
  </View>
);

export default function FlightDetailScreen() {
  const { id } = useLocalSearchParams();
  const { userToken } = useAuth();
  const [flight, setFlight] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // ... (data fetching logic is the same)
    const loadFlightDetails = async () => {
      try {
        if (userToken && id) {
          const fetchedFlight = await getFlightById(userToken, id);
          setFlight(fetchedFlight);
        }
      } catch (e) {
        setError(e.message);
      } finally {
        setIsLoading(false);
      }
    };
    loadFlightDetails();
  }, [userToken, id]);

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  if (error) {
    return (
      <View style={styles.center}>
        <Text>Error: {error}</Text>
      </View>
    );
  }
  if (!flight) {
    return (
      <View style={styles.center}>
        <Text>Flight not found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>
        {flight.airline} {flight.flightNumber}
      </Text>
      <Text style={styles.subHeader}>
        {flight.origin} to {flight.destination}
      </Text>

      {/* Conditionally render the SavingsDisplay component */}
      {flight.status === "savings_found" && <SavingsDisplay flight={flight} />}

      {/* We could add more flight details here if we wanted */}
    </View>
  );
}

// Add the new styles for the savings display
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: { fontSize: 24, fontWeight: "bold", marginBottom: 8 },
  subHeader: { fontSize: 18, color: "#666", marginBottom: 20 },
  // -- SavingsDisplay Styles --
  savingsContainer: {
    backgroundColor: "#E0F8E7", // Light green background
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#34C759", // Green border
    padding: 16,
    marginTop: 20,
  },
  savingsTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#006400", // Dark green
    textAlign: "center",
    marginBottom: 16,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  priceLabel: {
    fontSize: 16,
    color: "#555",
  },
  priceValue: {
    fontSize: 16,
    fontWeight: "600",
  },
  totalSavingsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#C8E6C9",
  },
  totalSavingsLabel: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#006400",
  },
  totalSavingsValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#006400",
  },
  instructions: {
    marginTop: 20,
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
    textAlign: "center",
  },
});
