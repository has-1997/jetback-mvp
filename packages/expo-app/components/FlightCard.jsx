import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Link } from "expo-router"; // 1. Import Link

// The FlightCard receives a 'flight' object as a prop
export default function FlightCard({ flight }) {
  const formattedDate = new Date(flight.departureTime).toLocaleDateString();

  // 2. Wrap the entire card in a Link component
  return (
    <Link href={`/flights/${flight.id}`} style={styles.linkContainer}>
      <View style={styles.card}>
        <View style={styles.routeContainer}>
          <Text style={styles.origin}>{flight.origin}</Text>
          <Text style={styles.arrow}>→</Text>
          <Text style={styles.destination}>{flight.destination}</Text>
        </View>
        <View style={styles.detailsContainer}>
          <Text style={styles.detailText}>
            {flight.airline} {flight.flightNumber}
          </Text>
          <Text style={styles.detailText}>{formattedDate}</Text>
        </View>
        <View
          style={[
            styles.statusBadge,
            flight.status === "On Time" ? styles.onTime : styles.delayed,
          ]}
        >
          <Text style={styles.statusText}>{flight.status}</Text>
        </View>
      </View>
    </Link>
  );
}

// 3. Add a new style for the link container
const styles = StyleSheet.create({
  linkContainer: {
    textDecorationLine: "none", // Prevents underline on web
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  // ... (the rest of the styles are the same)
  routeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  origin: {
    fontSize: 20,
    fontWeight: "bold",
  },
  arrow: {
    fontSize: 20,
    marginHorizontal: 10,
    color: "#888",
  },
  destination: {
    fontSize: 20,
    fontWeight: "bold",
  },
  detailsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  detailText: {
    fontSize: 14,
    color: "#555",
  },
  statusBadge: {
    alignSelf: "flex-start",
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  statusText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
  },
  onTime: {
    backgroundColor: "#34C759", // Green
  },
  delayed: {
    backgroundColor: "#FF3B30", // Red
  },
});
