import ListeningSession from "../models/ListeningSession.js";
import {
  generatePairingCode,
  sessionId,
} from "../utils/generatePairingCode.js";
export const snapshot = (s) => ({
  sessionId: s.sessionId,
  code: s.pairingCode,
  codeExpiresAt: s.pairingCodeExpiresAt,
  currentSongId: s.currentSongId,
  queue: s.queue,
  queueIndex: s.queueIndex,
  isPlaying: s.isPlaying,
  position: s.position,
  playbackUpdatedAt: s.playbackUpdatedAt,
  shuffle: s.shuffle,
  repeatMode: s.repeatMode,
  status: s.status,
  devices: s.connectedDevices.map(({ deviceId, name }) => ({ deviceId, name })),
});
export async function createSession(device) {
  const pairingCode = await generatePairingCode();
  return ListeningSession.create({
    sessionId: sessionId(),
    pairingCode,
    pairingCodeExpiresAt: new Date(Date.now() + 300000),
    hostDeviceId: device.deviceId,
    connectedDevices: [device],
  });
}
export async function findActive(code) {
  const s = await ListeningSession.findOne({
    pairingCode: code,
    status: "active",
  });
  if (!s || s.pairingCodeExpiresAt < new Date())
    throw new Error("This pairing code has expired");
  return s;
}
