import mongoose from "mongoose";
export default mongoose.model(
  "Playlist",
  new mongoose.Schema(
    {
      name: { type: String, required: true },
      description: String,
      coverImage: String,
      owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      songs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Song" }],
      isPublic: { type: Boolean, default: false },
    },
    { timestamps: true },
  ),
);
