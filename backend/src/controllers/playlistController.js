import Playlist from "../models/Playlist.js";
export async function list(req, res, next) {
  try {
    res.json(
      await Playlist.find({
        $or: [{ owner: req.user._id }, { isPublic: true }],
      })
        .populate("songs")
        .sort({ updatedAt: -1 }),
    );
  } catch (e) {
    next(e);
  }
}
export async function create(req, res, next) {
  try {
    res
      .status(201)
      .json(await Playlist.create({ ...req.body, owner: req.user._id }));
  } catch (e) {
    next(e);
  }
}
export async function getOne(req, res, next) {
  try {
    const p = await Playlist.findById(req.params.id).populate("songs");
    if (!p) return res.status(404).json({ message: "Playlist not found" });
    res.json(p);
  } catch (e) {
    next(e);
  }
}
export async function update(req, res, next) {
  try {
    const p = await Playlist.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      req.body,
      { new: true },
    ).populate("songs");
    if (!p) return res.status(404).json({ message: "Playlist not found" });
    res.json(p);
  } catch (e) {
    next(e);
  }
}
export async function remove(req, res, next) {
  try {
    const p = await Playlist.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });
    if (!p) return res.status(404).json({ message: "Playlist not found" });
    res.status(204).end();
  } catch (e) {
    next(e);
  }
}
