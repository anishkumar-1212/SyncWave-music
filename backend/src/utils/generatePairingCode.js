import ListeningSession from "../models/ListeningSession.js";
export async function generatePairingCode() {
  for (let i = 0; i < 20; i++) {
    const code = String(Math.floor(100000 + Math.random() * 900000));
    if (
      !(await ListeningSession.exists({
        pairingCode: code,
        status: "active",
        pairingCodeExpiresAt: { $gt: new Date() },
      }))
    )
      return code;
  }
  throw new Error("Could not create pairing code");
}
export const sessionId = () => crypto.randomUUID();
