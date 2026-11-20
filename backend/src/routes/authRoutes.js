import { Router } from "express";
import {
  login,
  register,
  toggleLike,
  liked,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
const r = Router();
r.post("/register", register);
r.post("/login", login);
r.get("/liked", protect, liked);
r.put("/liked/:songId", protect, toggleLike);
export default r;
