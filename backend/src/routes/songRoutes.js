import { Router } from "express";
import { list, getOne } from "../controllers/songController.js";
const r = Router();
r.get("/", list);
r.get("/:id", getOne);
export default r;
