// functions/index.js

// Import the Firebase Functions library, which gives us access to tools for creating Cloud Functions.
const functions = require("firebase-functions");
const { simpleParser } = require("mailparser");

// A function to extract data using a regular expression.
// It takes text and a regex pattern, finds the match, and returns it.
// We add a check for a "match group" which allows more precise extraction.
const extractData = (text, regex) => {
  const match = text.match(regex);
  // If a match is found, return the first "capturing group" (the part in parentheses),
  // otherwise, return null.
  return match ? match[1] : null;
};

/**
 * Defines the 'ingestFlightEmail' HTTP-triggered Cloud Function.
 * This function will listen for POST requests from our email service (SendGrid).
 */
exports.ingestFlightEmail = functions.https.onRequest(async (req, res) => {
  // Log a simple message to the Firebase console to show the function was triggered.
  functions.logger.info("ingestFlightEmail function was triggered!");

  // When SendGrid calls this webhook, it sends the raw email in a field called 'email'.
  // We grab that content here.
  const rawEmail = req.body.email;

  // It's good practice to check if the email content actually exists before proceeding.
  if (!rawEmail) {
    functions.logger.error("No email content found in the request body.");
    return res.status(400).send("Bad Request: Email content is missing.");
  }

  // A try...catch block is used for error handling.
  try {
    const parsedEmail = await simpleParser(rawEmail);
    const emailText = parsedEmail.text;

    // Define the regex patterns to find our specific data.
    // Looks for "Confirmation number: " followed by 6-8 alphanumeric characters.
    const pnrRegex = /Confirmation number: ([A-Z0-9]{6,8})/;
    // Looks for "Total price: $" followed by digits, a period, and more digits.
    const priceRegex = /Total price: \$(\d+\.\d{2})/;

    // Use our helper function to run the regex patterns on the email text.
    const pnr = extractData(emailText, pnrRegex);
    const price = extractData(emailText, priceRegex);

    // Log the extracted data to prove our regex worked.
    functions.logger.info("Extracted PNR:", pnr);
    functions.logger.info("Extracted Price:", price);

    // We'll add a check to make sure we found everything we needed.
    if (pnr && price) {
      res.status(200).send(`Success! Found PNR: ${pnr}, Price: ${price}`);
    } else {
      res.status(400).send("Could not extract all required flight details.");
    }
  } catch (error) {
    functions.logger.error("Error parsing email:", error);
    res.status(500).send("Error: Could not parse email.");
  }
});
