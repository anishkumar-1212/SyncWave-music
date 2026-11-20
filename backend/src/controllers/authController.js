import jwt from "jsonwebtoken";
import User from "../models/User.js";
const token = (user) =>
  jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
const payload = (user) => ({
  token: token(user),
  user: {
    id: user._id,
    username: user.username,
    email: user.email,
    likedSongs: user.likedSongs,
  },
});
export async function register(req, res, next) {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || password?.length < 6)
      return res
        .status(400)
        .json({
          message: "Provide a username, valid email, and 6+ character password",
        });
    if (await User.exists({ email }))
      return res.status(409).json({ message: "Email already registered" });
    res
      .status(201)
      .json(payload(await User.create({ username, email, password })));
  } catch (e) {
    next(e);
  }
}
export async function login(req, res, next) {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user || !(await user.matchPassword(req.body.password)))
      return res.status(401).json({ message: "Invalid email or password" });
    res.json(payload(user));
  } catch (e) {
    next(e);
  }
}
export async function toggleLike(req, res, next) {
  try {
    const u = req.user,
      id = req.params.songId;
    const has = u.likedSongs.some((x) => x.equals(id));
    u.likedSongs = has
      ? u.likedSongs.filter((x) => !x.equals(id))
      : [...u.likedSongs, id];
    await u.save();
    res.json({ likedSongs: u.likedSongs });
  } catch (e) {
    next(e);
  }
}
export async function liked(req, res, next) {
  try {
    res.json(await req.user.populate("likedSongs").then((u) => u.likedSongs));
  } catch (e) {
    next(e);
  }
}
