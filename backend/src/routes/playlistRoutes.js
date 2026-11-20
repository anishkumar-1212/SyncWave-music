import { Router } from "express";
import * as c from "../controllers/playlistController.js";
import { protect } from "../middleware/authMiddleware.js";
const r = Router();
r.use(protect);
r.route("/").get(c.list).post(c.create);
r.route("/:id").get(c.getOne).put(c.update).delete(c.remove);
export default r;
