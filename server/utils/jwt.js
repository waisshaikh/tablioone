import jwt from "jsonwebtoken";

const APP_JWT_SECRET = process.env.JWT_SECRET || "super-secret-key";

// generate a signed token for the app
export function signAppToken(user) {
  return jwt.sign(
    { id: user._id, phone: user.phone, role: user.role },
    APP_JWT_SECRET,
    { expiresIn: "7d" }
  );
}

// middleware (if you need it later)
export function verifyAppToken(token) {
  try {
    return jwt.verify(token, APP_JWT_SECRET);
  } catch (err) {
    return null;
  }
}
