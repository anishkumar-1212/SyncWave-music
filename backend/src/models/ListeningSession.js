import mongoose from "mongoose";
const device = new mongoose.Schema(
  {
    deviceId: String,
    name: String,
    socketId: String,
    joinedAt: { type: Date, default: Date.now },
  },
  { _id: false },
);
const schema = new mongoose.Schema(
  {
    sessionId: { type: String, unique: true, index: true, required: true },
    pairingCode: { type: String, unique: true, sparse: true, index: true },
    pairingCodeExpiresAt: Date,
    hostDeviceId: { type: String, required: true },
    connectedDevices: [device],
    currentSongId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Song",
      default: null,
    },
    queue: [{ type: mongoose.Schema.Types.ObjectId, ref: "Song" }],
    queueIndex: { type: Number, default: 0 },
    isPlaying: { type: Boolean, default: false },
    position: { type: Number, default: 0 },
    playbackUpdatedAt: { type: Date, default: Date.now },
    shuffle: { type: Boolean, default: false },
    repeatMode: { type: String, enum: ["off", "all", "one"], default: "off" },
    status: { type: String, enum: ["active", "ended"], default: "active" },
  },
  { timestamps: true },
);
export default mongoose.model("ListeningSession", schema);
