import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";

export const protect = (roles = []) => {
  return (req, res, next) => {
    try {
      let token = null;

      // 1) check cookie
      if (req.cookies && req.cookies.token) {
        token = req.cookies.token;
      }

      // 2) fallback Authorization header
      if (!token && req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
        token = req.headers.authorization.split(" ")[1];
      }

      if (!token) return res.status(401).json({ message: "No token provided" });

      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;

      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(403).json({ message: "Forbidden" });
      }

      next();
    } catch (err) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
  };
};
