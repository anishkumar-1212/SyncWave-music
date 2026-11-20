import "dotenv/config";
import http from "http";
import { Server } from "socket.io";
import app from "./app.js";
import { connectDB } from "./config/db.js";
import { socketHandler } from "./sockets/socketHandler.js";
import { startJamendoAutoImport } from "./services/jamendoService.js";
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: process.env.CLIENT_URL?.split(",") || "*" },
});
socketHandler(io);
connectDB()
  .then(() =>
    server.listen(process.env.PORT || 5001, () => {
      console.log("SyncWave API running");
      startJamendoAutoImport();
    }),
  )
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
