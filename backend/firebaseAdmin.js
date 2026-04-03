// firebaseAdmin.js
import admin from "firebase-admin";
import dotenv from "dotenv";

dotenv.config();

// Load Firebase service account from .env (as JSON string)
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export default admin;
