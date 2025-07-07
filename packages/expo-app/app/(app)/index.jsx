import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { useAuth } from "@/context/AuthContext";
import { getFlights } from "@/api/api";
import FlightCard from "@/components/FlightCard";


export default function DashboardScreen() {
  const { userToken } = useAuth();
  const [flights, setFlights] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadFlights = async () => {
      try {
        // We must have a token to fetch flights
        if (userToken) {
          const fetchedFlights = await getFlights(userToken);
          setFlights(fetchedFlights);
        }
      } catch (e) {
        setError(e.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadFlights();
  }, [userToken]); // Re-run effect if the token changes

  // Render a loading spinner while fetching
  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Render an error message if something went wrong
  if (error) {
    return (
      <View style={styles.center}>
        <Text>Error fetching flights: {error}</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={flights}
      // The keyExtractor tells the list how to identify unique items
      keyExtractor={(item) => item.id}
      // The renderItem function specifies what to render for each item in the data
      renderItem={({ item }) => <FlightCard flight={item} />}
      // Add some styling to the list itself
      contentContainerStyle={styles.list}
      // Use the ListHeaderComponent prop to render the title
      ListHeaderComponent={() => <Text style={styles.title}>Your Flights</Text>}
      // Use the ListEmptyComponent prop to show a message when there's no data
      ListEmptyComponent={() => (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            You are not tracking any flights yet.
          </Text>
        </View>
      )}
    />
  );
}
const styles = StyleSheet.create({
  list: {
    padding: 20,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50, // Give it some space from the title
  },
  emptyText: {
    fontSize: 16,
    color: "#888",
  },
});