import mongoose from "mongoose";

const dishSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    category: { type: String, required: true },
    image: String, // Cloudinary URL
    inStock: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Dish", dishSchema);
