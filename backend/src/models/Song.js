import mongoose from "mongoose";
export default mongoose.model(
  "Song",
  new mongoose.Schema(
    {
      title: { type: String, required: true, index: true },
      artist: { type: String, required: true, index: true },
      album: String,
      albumArt: String,
      audioUrl: { type: String, required: true },
      duration: Number,
      genre: String,
      year: Number,
      description: String,
      source: { type: String, default: "manual", index: true },
      sourceId: { type: String, sparse: true },
      licenseUrl: String,
      providerUrl: String,
      tags: [String],
    },
    { timestamps: true },
  ),
);
