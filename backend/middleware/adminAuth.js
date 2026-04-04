// middleware/adminAuth.js
import jwt from "jsonwebtoken";

export default function adminAuth(req, res, next) {
  try {
    const auth = req.headers.authorization || "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
    if (!token) return res.status(401).json({ message: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    req.admin = decoded; 
    next();
  } catch (err) {
    console.error("adminAuth middleware error:", err.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}
