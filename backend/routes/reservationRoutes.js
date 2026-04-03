import express from "express";
import Reservation from "../models/Reservation.js";

const router = express.Router();

// Create reservation
router.post("/", async (req, res) => {
  try {
    const reservation = new Reservation(req.body);
    await reservation.save();
    res.status(201).json({ success: true, reservation });
  } catch (err) {
    console.error("❌ Reservation create error:", err);
    res.status(500).json({ success: false, message: "Failed to create reservation" });
  }
});

// Get all reservations (Admin)
router.get("/", async (_req, res) => {
  try {
    const reservations = await Reservation.find().sort({ createdAt: -1 });
    res.json({ success: true, reservations });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Update reservation status
router.put("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    const reservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.json({ success: true, reservation });
  } catch (err) {
    console.error("❌ Reservation update error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
