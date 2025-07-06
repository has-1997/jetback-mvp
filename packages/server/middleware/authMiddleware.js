// We need the 'jsonwebtoken' library to verify the token.
const jwt = require("jsonwebtoken");

// This is our middleware function.
const verifyAuthToken = (req, res, next) => {
  // We look for the token in the 'Authorization' header.
  // By convention, it's sent as 'Bearer <token>'.
  const authHeader = req.headers["authorization"];

  // If the header exists, we extract just the token part.
  const token = authHeader && authHeader.split(" ")[1];

  // If there's no token at all, we deny access with a 401 'Unauthorized' status.
  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  try {
    // We try to verify the token using our secret key.
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // If verification is successful, the 'decoded' variable will contain the payload (uid, email).
    // We attach this decoded payload to the request object as 'req.user'.
    // This way, any subsequent route handler can access the logged-in user's info.
    req.user = decoded;

    // We call next() to pass control to the next function in the middleware chain (the actual route handler).
    next();
  } catch (error) {
    // If jwt.verify fails (e.g., bad signature, expired token), it throws an error.
    // We catch it and respond with a 403 'Forbidden' status.
    res.status(403).json({ error: "Invalid token." });
  }
};

// We export our middleware so we can use it in our route files.
module.exports = verifyAuthToken;
