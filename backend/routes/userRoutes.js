// routes/userRoutes.js
import express from "express";
import multer from "multer";
import cloudinary from "cloudinary";
import User from "../models/User.js";

const router = express.Router();

// ===== Multer: keep file in memory =====
const upload = multer({ storage: multer.memoryStorage() });

// ===== Cloudinary config =====
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Helper: upload buffer to Cloudinary with a Promise
function uploadBufferToCloudinary(buffer, folder = "profiles") {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.v2.uploader.upload_stream(
      { folder, resource_type: "image" }, // 
      (err, result) => {
        if (err) return reject(err);
        resolve(result.secure_url);
      }
    );
    stream.end(buffer);
  });
}

// ===== POST /api/users  (create/update user profile) =====
router.post("/", upload.single("avatar"), async (req, res) => {
  try {
    const { email, name,  address } = req.body;
    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "email is required" });
    }

    // Upload to Cloudinary if avatar present
    let profileImage;
    if (req.file?.buffer) {
      profileImage = await uploadBufferToCloudinary(req.file.buffer, "profiles");
    }

    // Build update object
    const update = {
      ...(name && { name }),
      ...(email && { email }),
      ...(address && { address }),
      ...(profileImage && { profileImage }),
    };

    // Find by email and update (or insert new)
    const user = await User.findOneAndUpdate({ email }, update, {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
    });

    return res.json({ success: true, user });
  } catch (err) {
    console.error("❌ Error saving user:", err);
    return res
      .status(500)
      .json({ success: false, message: err.message || "Server error" });
  }
});

// ===== GET /api/users/:email  (fetch user by email) =====
router.get("/:email", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    return res.json({ success: true, user });
  } catch (err) {
    console.error("❌ Error fetching user:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
