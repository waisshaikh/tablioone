// routes/cartRoutes.js
import express from "express";
import User from "../models/User.js";

const router = express.Router();

// Get cart
router.get("/:phone", async (req, res) => {
  try {
    const user = await User.findOne({ phone: req.params.phone });
    if (!user) return res.json({ cart: [] });
    res.json({ cart: user.cart || [] });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Save/replace cart
router.post("/:phone", async (req, res) => {
  try {
    const { cart } = req.body;
    const user = await User.findOneAndUpdate(
      { phone: req.params.phone },
      { cart },
      { new: true }
    );
    res.json({ success: true, cart: user.cart });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
