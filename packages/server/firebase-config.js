// This line loads the firebase-admin library.
const admin = require("firebase-admin");

// We parse the JSON string from our .env file back into a JavaScript object.
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

// This initializes the Firebase Admin SDK.
admin.initializeApp({
  // We provide the service account credentials to authenticate our server with Firebase.
  credential: admin.credential.cert(serviceAccount),
});

// We get a reference to our Firestore database.
const db = admin.firestore();
// We get a reference to our Firebase Authentication service.
const auth = admin.auth();

// We export the database and auth objects so they can be used in other files.
module.exports = { db, auth };
