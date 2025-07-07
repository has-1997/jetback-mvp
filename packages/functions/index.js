// functions/index.js

const functions = require("firebase-functions"); // For our v1 function
const { defineSecret } = require("firebase-functions/params");
const { simpleParser } = require("mailparser");
const admin = require("firebase-admin");
const { onSchedule } = require("firebase-functions/v2/scheduler"); // For our v2 function
const { Duffel } = require("@duffel/api");
const logger = require("firebase-functions/logger"); // The new v2 logger

// Define the secret that our function will use.
const duffelApiKey = defineSecret("DUFFEL_API_KEY");

admin.initializeApp();

const extractData = (text, regex) => {
  const match = text.match(regex);
  return match ? match[1] : null;
};

// THIS IS OUR v1 FUNCTION - IT STILL USES functions.logger
exports.ingestFlightEmail = functions.https.onRequest(async (req, res) => {
  functions.logger.info("ingestFlightEmail function was triggered!");
  // ... rest of the v1 function is unchanged and correct
  const rawEmail = req.body.email;

  if (!rawEmail) {
    functions.logger.error("No email content found in the request body.");
    return res.status(400).send("Bad Request: Email content is missing.");
  }

  try {
    const parsedEmail = await simpleParser(rawEmail);
    const emailText = parsedEmail.text;

    const pnrRegex = /Confirmation number: ([A-Z0-9]{6,8})/;
    const priceRegex = /Total price: \$(\d+\.\d{2})/;

    const pnr = extractData(emailText, pnrRegex);
    const price = extractData(emailText, priceRegex);

    functions.logger.info("Extracted PNR:", pnr);
    functions.logger.info("Extracted Price:", price);

    if (pnr && price) {
      const newFlight = {
        pnr: pnr,
        initialPrice: parseFloat(price),
        status: "tracking",
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        userId: "DUMMY_USER_ID_123",
        origin: "ORD",
        destination: "LGA",
        departureDate: "2025-12-25",
      };

      const writeResult = await admin
        .firestore()
        .collection("flights")
        .add(newFlight);
      functions.logger.info(
        `Successfully stored flight with ID: ${writeResult.id}`
      );

      res
        .status(200)
        .send(`Successfully stored flight with ID: ${writeResult.id}`);
    } else {
      res.status(400).send("Could not extract all required flight details.");
    }
  } catch (error) {
    functions.logger.error("Error processing flight:", error);
    res.status(500).send("Error: Could not process email.");
  }
});

// THIS IS OUR v2 FUNCTION - IT NOW USES THE NEW logger
exports.runPriceChecks = onSchedule(
  {
    schedule: "every 6 hours",
    secrets: [duffelApiKey],
    memory: "256MiB",
  },
  async (event) => {
    // We now use logger.info, not functions.logger.info
    logger.info("runPriceChecks scheduler was triggered!");

    const duffel = new Duffel({
      token: duffelApiKey.value(),
    });

    const flightsRef = admin.firestore().collection("flights");
    const query = flightsRef.where("status", "==", "tracking");

    try {
      const snapshot = await query.get();

      if (snapshot.empty) {
        logger.info('No flights with status "tracking" found.');
        return null;
      }

      logger.info(`Found ${snapshot.size} flights to check.`);

      for (const doc of snapshot.docs) {
        const flightData = doc.data();
        const flightId = doc.id;

        logger.info(
          `Checking price for flight ${flightId} (${flightData.origin} -> ${flightData.destination})`
        );

        try {
          const offerRequest = await duffel.offerRequests.create({
            slices: [
              {
                origin: flightData.origin,
                destination: flightData.destination,
                departure_date: flightData.departureDate,
              },
            ],
            passengers: [{ type: "adult" }],
            cabin_class: "economy",
          });

          if (offerRequest.data.offers && offerRequest.data.offers.length > 0) {
            const currentPrice = parseFloat(
              offerRequest.data.offers[0].total_amount
            );
            const initialPrice = flightData.initialPrice;

            logger.info(
              `Comparing prices for flight ${flightId}: Initial: ${initialPrice}, Current: ${currentPrice}`
            );

            if (currentPrice < initialPrice) {
              logger.info(
                `!!! Savings found for flight ${flightId}. Updating database...`
              );

              // --- FINAL DATABASE UPDATE LOGIC ---
              const flightToUpdateRef = admin
                .firestore()
                .collection("flights")
                .doc(flightId);

              await flightToUpdateRef.update({
                status: "savings_found", // Change the status!
                newPrice: currentPrice, // Store the new lower price.
                lastChecked: admin.firestore.FieldValue.serverTimestamp(), // Timestamp the check.
              });

              logger.info(
                `Successfully updated flight ${flightId} to 'savings_found'.`
              );
              // --- END OF UPDATE LOGIC ---
            } else {
              logger.info(`No savings found for flight ${flightId}.`);
            }
          } else {
            logger.warn(
              `No offers returned from Duffel for flight ${flightId}.`
            );
          }
        } catch (apiError) {
          logger.error(`Duffel API error for flight ${flightId}:`, apiError);
        }
      }
      return null;
    } catch (dbError) {
      logger.error("Error querying for active flights:", dbError);
      return null;
    }
  }
);
