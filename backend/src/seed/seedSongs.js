import "dotenv/config";
import { connectDB } from "../config/db.js";
import Song from "../models/Song.js";
const songs = [
  [
    "A New Beginning",
    "Bensound",
    "Acoustic Breeze",
    "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=500",
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    "Acoustic",
  ],
  [
    "Night Drive",
    "Scott Buckley",
    "Neon Horizons",
    "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500",
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    "Electronic",
  ],
  [
    "Open Sky",
    "Lukrembo",
    "Daylight",
    "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=500",
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    "Chill",
  ],
].map(([title, artist, album, albumArt, audioUrl, genre]) => ({
  title,
  artist,
  album,
  albumArt,
  audioUrl,
  genre,
}));
await connectDB();
await Song.deleteMany({});
await Song.insertMany(songs);
console.log("Seeded songs");
process.exit();
