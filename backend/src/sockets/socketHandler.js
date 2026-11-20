import {
  createSession,
  findActive,
  snapshot,
} from "../services/sessionService.js";
import ListeningSession from "../models/ListeningSession.js";
export function socketHandler(io) {
  io.on("connection", (socket) => {
    const reply = (cb, data) => typeof cb === "function" && cb(data);
    const room = (id) => `session:${id}`;
    socket.on("session:create", async ({ deviceId, name }, cb) => {
      try {
        const s = await createSession({
          deviceId,
          name: name || "Device",
          socketId: socket.id,
        });
        socket.join(room(s.sessionId));
        socket.data.sessionId = s.sessionId;
        socket.data.deviceId = deviceId;
        reply(cb, { ok: true, state: snapshot(s) });
        socket.emit("session:created", snapshot(s));
      } catch (e) {
        reply(cb, { ok: false, message: e.message });
      }
    });
    socket.on("session:join", async ({ code, deviceId, name }, cb) => {
      try {
        const s = await findActive(code);
        if (
          !s.connectedDevices.some((d) => d.deviceId === deviceId) &&
          s.connectedDevices.length >= 2
        )
          throw new Error("This session already has two devices");
        s.connectedDevices = s.connectedDevices.filter(
          (d) => d.deviceId !== deviceId,
        );
        s.connectedDevices.push({
          deviceId,
          name: name || "Device",
          socketId: socket.id,
        });
        await s.save();
        socket.join(room(s.sessionId));
        socket.data.sessionId = s.sessionId;
        socket.data.deviceId = deviceId;
        const state = snapshot(s);
        reply(cb, { ok: true, state });
        io.to(room(s.sessionId)).emit("session:state", state);
        io.to(room(s.sessionId)).emit("device:connected", state.devices);
      } catch (e) {
        reply(cb, { ok: false, message: e.message });
      }
    });
    socket.on("playback:command", async (command) => {
      try {
        const s = await ListeningSession.findOne({
          sessionId: socket.data.sessionId,
          status: "active",
        });
        if (
          !s ||
          !s.connectedDevices.some((d) => d.deviceId === socket.data.deviceId)
        )
          return;
        const now = new Date();
        const current = () =>
          s.isPlaying
            ? s.position + (now - s.playbackUpdatedAt) / 1000
            : s.position;
        if (command.type === "play") {
          s.position = Number(command.position ?? current());
          s.isPlaying = true;
        } else if (command.type === "pause") {
          s.position = Number(command.position ?? current());
          s.isPlaying = false;
        } else if (command.type === "seek") {
          s.position = Math.max(0, Number(command.position) || 0);
        } else if (command.type === "select") {
          s.currentSongId = command.songId;
          s.position = 0;
          s.isPlaying = command.isPlaying ?? true;
          if (command.queue) s.queue = command.queue;
          s.queueIndex = command.queueIndex ?? 0;
        } else if (command.type === "queue") {
          s.queue = command.queue || [];
          s.queueIndex = command.queueIndex ?? 0;
        } else if (command.type === "settings") {
          if (typeof command.shuffle === "boolean") s.shuffle = command.shuffle;
          if (command.repeatMode) s.repeatMode = command.repeatMode;
        } else return;
        s.playbackUpdatedAt = now;
        await s.save();
        io.to(room(s.sessionId)).emit("playback:state", snapshot(s));
      } catch (e) {
        socket.emit("session:error", { message: e.message });
      }
    });
    socket.on("session:leave", async () => {
      const s = await ListeningSession.findOne({
        sessionId: socket.data.sessionId,
      });
      if (!s) return;
      s.connectedDevices = s.connectedDevices.filter(
        (d) => d.deviceId !== socket.data.deviceId,
      );
      await s.save();
      io.to(room(s.sessionId)).emit("device:disconnected", snapshot(s).devices);
      socket.leave(room(s.sessionId));
    });
    socket.on("session:end", async () => {
      const s = await ListeningSession.findOne({
        sessionId: socket.data.sessionId,
      });
      if (s && s.hostDeviceId === socket.data.deviceId) {
        s.status = "ended";
        s.pairingCode = undefined;
        await s.save();
        io.to(room(s.sessionId)).emit("session:error", {
          message: "The listening session ended",
        });
      }
    });
    socket.on("disconnect", async () => {
      const s = await ListeningSession.findOne({
        sessionId: socket.data.sessionId,
      });
      if (s) {
        s.connectedDevices = s.connectedDevices.filter(
          (d) => d.deviceId !== socket.data.deviceId,
        );
        await s.save();
        io.to(room(s.sessionId)).emit(
          "device:disconnected",
          snapshot(s).devices,
        );
      }
    });
  });
}
