// routes/adminAuth.js
import express from "express";
import { adminLogin, getMe } from "../controllers/adminAuthController.js";
import adminAuth from "../middleware/adminAuth.js";

const router = express.Router();

// Login → returns { token, admin }
router.post("/login", adminLogin);

// Check current admin (protected)
router.get("/me", adminAuth, getMe);

export default router;
