import Fact from "../models/Fact.js";

// GET random fact
export const getRandomFact = async (req, res) => {
  try {
    const count = await Fact.countDocuments();
    const random = Math.floor(Math.random() * count);
    const fact = await Fact.findOne().skip(random);

    if (!fact) return res.status(404).json({ message: "No facts found" });
    res.json(fact);
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};
