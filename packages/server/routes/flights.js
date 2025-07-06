const express = require("express");
const { db } = require("../firebase-config"); // Adjust path if firebase-config is elsewhere
const verifyAuthToken = require("../middleware/authMiddleware");

// Create a new router instance
const router = express.Router();

// --- GET All Flights for a User ---
// This route is PROTECTED. The verifyAuthToken middleware runs first.
router.get("/", verifyAuthToken, async (req, res) => {
  // We'll add the logic here in the next step.
  res.send("GET /flights endpoint reached. User is: " + req.user.email);
});

// --- POST a New Flight for a User ---
// This route is also PROTECTED.
router.post("/", verifyAuthToken, async (req, res) => {
  // We'll add logic here later.
  res.send("POST /flights endpoint reached. User is: " + req.user.email);
});

module.exports = router;
