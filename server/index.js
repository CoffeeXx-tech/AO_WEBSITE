import { createServer } from "http";
import { Server } from "socket.io";
import { nanoid } from "nanoid";

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: { origin: "*", methods: ["GET", "POST"] }, // pozwala na połączenia z dowolnego frontendu
});

const TICK = 50; // 20 Hz
const players = new Map();

io.on("connection", (socket) => {
  const playerId = nanoid(8);
  
  // pozycja: +2 w prawo w zależności od liczby graczy
  const xOffset = players.size * 2;
  const player = { id: playerId, x: xOffset, y: 0, z: 0 };
  players.set(playerId, player);

  socket.emit("welcome", { id: playerId, snapshot: Array.from(players.values()) });
  socket.broadcast.emit("player_joined", player);

  socket.on("disconnect", () => {
    players.delete(playerId);
    socket.broadcast.emit("player_left", playerId);
  });

  socket.on("move", (pos) => {
    const p = players.get(playerId);
    if (!p) return;
    p.x = pos.x;
    p.y = pos.y;
    p.z = pos.z;
    io.emit("state", Array.from(players.values()));
  });
});

httpServer.listen(3001, () => console.log("Server listening on :3001"));
