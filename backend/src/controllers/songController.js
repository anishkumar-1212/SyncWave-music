import Song from "../models/Song.js";
export async function list(req, res, next) {
  try {
    const q = req.query.q?.trim();
    const filter = q
      ? {
          $or: ["title", "artist", "album", "genre"].map((k) => ({
            [k]: { $regex: q, $options: "i" },
          })),
        }
      : {};
    res.json(await Song.find(filter).sort({ createdAt: -1 }));
  } catch (e) {
    next(e);
  }
}
export async function getOne(req, res, next) {
  try {
    const s = await Song.findById(req.params.id);
    if (!s) return res.status(404).json({ message: "Song not found" });
    res.json(s);
  } catch (e) {
    next(e);
  }
}
