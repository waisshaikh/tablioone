import express from "express";
import Fact from "../models/Fact.js";

const router = express.Router();

// Get random fact
router.get("/random", async (req, res) => {
  try {
    const count = await Fact.countDocuments();
    const random = Math.floor(Math.random() * count);
    const fact = await Fact.findOne().skip(random);
    res.json(fact);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch random fact" });
  }
});

export default router;
    