const verifyAuthToken = require("../middleware/authMiddleware");
const express = require("express");
const jwt = require("jsonwebtoken"); // For creating tokens
const { auth, db } = require("../firebase-config"); // Our Firebase connection

// We create a new Router object. This object will handle all auth-related routes.
const router = express.Router();

// -- We are keeping our health check for now --
router.get("/health", (req, res) => {
  res.json({ status: "ok", message: "Auth router is healthy" });
});

// -- NEW SIGNUP ENDPOINT --
// This is a POST endpoint because the client is sending data (email/password) to create something new.
router.post("/signup", async (req, res) => {
  try {
    // We get the email and password from the JSON body of the request.
    const { email, password } = req.body;

    // We check if an email and password were actually provided.
    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Email and password are required." });
    }

    // Use Firebase Auth to create a new user.
    // This will handle most of the difficult work for us.
    const userRecord = await auth.createUser({
      email: email,
      password: password,
    });

    // When the user is created, we also create a document for them in our 'users' collection.
    // We use the unique user ID (uid) from Firebase Auth as the document ID.
    await db.collection("users").doc(userRecord.uid).set({
      email: userRecord.email,
      createdAt: new Date().toISOString(),
    });

    // Now, we create a JWT (our digital ID card) to send back to the user.
    // The token's "payload" contains the user's unique ID.
    const token = jwt.sign(
      { uid: userRecord.uid, email: userRecord.email },
      process.env.JWT_SECRET, // We sign it with our secret key from the .env file.
      { expiresIn: "1h" } // We set the token to expire in 1 hour.
    );

    // We send a 201 "Created" status and the token back to the client.
    res.status(201).json({ token });
  } catch (error) {
    // If an error happens (e.g., email already exists), Firebase sends an error.
    console.error("Error during signup:", error);
    // We send back a specific error message if the email is already in use.
    if (error.code === "auth/email-already-exists") {
      return res.status(409).json({ error: "Email already in use." });
    }
    // For any other errors, we send a generic server error message.
    res.status(500).json({ error: "An unexpected error occurred." });
  }
});

// -- NEW LOGIN ENDPOINT --
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Email and password are required." });
    }

    // TODO: Implement the full, secure Firebase ID Token verification flow.
    // For now, we are creating a "mock" login for backend testing.
    // We look up the user by their email address.
    const userRecord = await auth.getUserByEmail(email);

    // In a real app, you would verify the password here.
    // Since the Admin SDK can't directly verify passwords, the proper flow
    // involves the client sending a Firebase ID Token, which we verify here.
    // For our current testing purposes, we'll assume the user is legitimate if they exist.

    // If the user exists, we'll generate our custom JWT for them.
    const token = jwt.sign(
      { uid: userRecord.uid, email: userRecord.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Send the token back to the client.
    res.status(200).json({ token });
  } catch (error) {
    // This error code means the user with that email was not found.
    if (error.code === "auth/user-not-found") {
      return res.status(404).json({ error: "Invalid credentials." });
    }
    console.error("Error during login:", error);
    res.status(500).json({ error: "An unexpected error occurred." });
  }
});

// --- NEW LOGOUT ENDPOINT ---
// This endpoint doesn't need to do much on the server-side for JWTs.
// Its main purpose is to give the client a formal endpoint to call when the user logs out.
// The client is responsible for deleting the token.
router.post("/logout", (req, res) => {
  // A real implementation might add the token to a "blacklist" in a database like Redis.
  // For our simple case, we just acknowledge the request.
  res.status(200).json({ message: "Logout successful. Please delete your token." });
});

// -- NEW PROTECTED TEST ROUTE --
// We add our 'verifyAuthToken' middleware here.
// Any request to this endpoint must first pass through the middleware.
router.get('/me', verifyAuthToken, (req, res) => {
  // If the request gets this far, it means the token was valid.
  // The middleware has already decoded the token and attached the user info to req.user.
  // We can now safely use req.user to know who is making the request.
  res.status(200).json({ user: req.user });
});

// This line makes our router available to other files (specifically, index.js).
module.exports = router;
