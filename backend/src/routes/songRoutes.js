import { Router } from "express";
import { list, getOne, importJamendo } from "../controllers/songController.js";
import { protect } from "../middleware/authMiddleware.js";
const r = Router();
r.post("/import/jamendo", protect, importJamendo);
r.get("/", list);
r.get("/:id", getOne);
export default r;
