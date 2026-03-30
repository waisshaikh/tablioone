import express from "express";
import multer from "multer";
import cloudinary from "cloudinary";
import Dish from "../models/Dish.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Cloudinary config
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

function uploadBufferToCloudinary(buffer, folder = "dishes") {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.v2.uploader.upload_stream({ folder }, (err, result) => {
      if (err) return reject(err);
      resolve(result.secure_url);
    });
    stream.end(buffer);
  });
}

// Create Dish
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { name, description, price, category, inStock } = req.body;

    let imageUrl = "";
    if (req.file && req.file.buffer) {
      imageUrl = await uploadBufferToCloudinary(req.file.buffer);
    }

    const dish = await Dish.create({
      name,
      description,
      price,
      category,
      image: imageUrl,
      inStock: inStock === "true",
    });

    res.json({ success: true, dish });
  } catch (err) {
    console.error("❌ Error creating dish:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// Read all dishes
router.get("/", async (req, res) => {
  const dishes = await Dish.find();
  res.json({ success: true, dishes });
});

// Update dish
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const { name, description, price, category, inStock } = req.body;

    let update = { name, description, price, category, inStock: inStock === "true" };

    if (req.file && req.file.buffer) {
      update.image = await uploadBufferToCloudinary(req.file.buffer);
    }

    const dish = await Dish.findByIdAndUpdate(req.params.id, update, { new: true });
    res.json({ success: true, dish });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Delete dish
router.delete("/:id", async (req, res) => {
  try {
    await Dish.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Dish deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
