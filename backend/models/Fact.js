import mongoose from "mongoose";

const factSchema = new mongoose.Schema({
  en: { type: String, required: true },   // English fact (required)
  mr: { type: String, required: true },   // Marathi fact (required)
});

export default mongoose.model("Fact", factSchema);
