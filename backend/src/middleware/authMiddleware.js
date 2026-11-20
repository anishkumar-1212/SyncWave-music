import jwt from "jsonwebtoken";
import User from "../models/User.js";
export async function protect(req, res, next) {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) throw new Error();
    req.user = await User.findById(
      jwt.verify(token, process.env.JWT_SECRET).id,
    );
    if (!req.user) throw new Error();
    next();
  } catch {
    res.status(401).json({ message: "Authentication required" });
  }
}
