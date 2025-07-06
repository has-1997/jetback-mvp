const express = require("express");
const { db } = require("../firebase-config"); // Adjust path if firebase-config is elsewhere
const verifyAuthToken = require("../middleware/authMiddleware");

// Create a new router instance
const router = express.Router();

// --- GET All Flights for a User ---
// This route is PROTECTED. The verifyAuthToken middleware runs first.
router.get("/", verifyAuthToken, async (req, res) => {
  try {
    // 1. Get the logged-in user's ID from the token (added by middleware)
    const userId = req.user.uid;

    // 2. Query the 'flights' collection in Firestore
    const flightsQuery = await db
      .collection("flights")
      .where("userId", "==", userId)
      .get();

    // 3. Map over the documents and create an array of flight data
    const flights = flightsQuery.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // 4. Send the array of flights back to the client
    res.status(200).json(flights);
  } catch (error) {
    console.error("Error fetching flights:", error);
    res.status(500).json({ error: "Failed to fetch flights" });
  }
});

// --- POST a New Flight for a User ---
// This route is also PROTECTED.
router.post("/", verifyAuthToken, async (req, res) => {
  try {
    // 1. Get the logged-in user's ID from the token
    const userId = req.user.uid;

    // 2. Get the flight details from the request's JSON body
    const { flightNumber, airline, origin, destination, departureTime, status } = req.body;

    // 3. Create a new flight object, including the owner's userId
    const newFlight = {
      userId, // This links the flight to the user
      flightNumber,
      airline,
      origin,
      destination,
      departureTime,
      status,
      createdAt: new Date().toISOString(), // Add a timestamp
    };

    // 4. Add the new flight object to the 'flights' collection
    const docRef = await db.collection("flights").add(newFlight);

    // 5. Send a response with the newly created document's ID
    res.status(201).json({ id: docRef.id, ...newFlight });

  } catch (error) {
    console.error("Error creating flight:", error);
    res.status(500).json({ error: "Failed to create flight" });
  }
});

// --- GET a Single Flight by its ID ---
// This route is also protected.
router.get("/:id", verifyAuthToken, async (req, res) => {
  try {
    // 1. Get the user's ID and the requested flight's ID
    const userId = req.user.uid;
    const flightId = req.params.id;

    // 2. Get the specific document from the 'flights' collection
    const flightDoc = await db.collection("flights").doc(flightId).get();

    // 3. Check if the flight document even exists
    if (!flightDoc.exists) {
      return res.status(404).json({ error: "Flight not found." });
    }

    // 4. CRITICAL: Verify that the flight belongs to the user
    const flightData = flightDoc.data();
    if (flightData.userId !== userId) {
      // If they don't match, deny access. This prevents user A from seeing user B's flight.
      return res.status(403).json({ error: "Forbidden: You do not have access to this resource." });
    }

    // 5. If all checks pass, send the flight data
    res.status(200).json({ id: flightDoc.id, ...flightData });

  } catch (error) {
    console.error("Error fetching single flight:", error);
    res.status(500).json({ error: "Failed to fetch flight" });
  }
});

module.exports = router;
