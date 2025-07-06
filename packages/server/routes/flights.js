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

module.exports = router;
