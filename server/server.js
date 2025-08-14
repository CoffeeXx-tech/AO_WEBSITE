import { createServer } from "http";
import { Server } from "socket.io";
import { nanoid } from "nanoid";

const PORT = process.env.PORT || 3001;

const httpServer = createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Server działa\n");
});

const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const players = new Map();

io.on("connection", (socket) => {
  console.log("Nowy gracz podłączony:", socket.id);

  const xOffset = players.size * 2;
  const playerId = nanoid(8);
  const player = { id: playerId, x: xOffset, y: 0, z: 0 };
  players.set(playerId, player);

  socket.emit("welcome", { id: playerId, snapshot: Array.from(players.values()) });
  socket.broadcast.emit("player_joined", player);

  socket.on("playerMove", (data) => {
    const p = players.get(playerId);
    if (!p) return;
    p.x = data.x;
    p.y = data.y;
    p.z = data.z;

    io.emit("state", Array.from(players.values()));
  });

  socket.on("disconnect", () => {
    console.log("Gracz odłączony:", socket.id);
    players.delete(playerId);
    socket.broadcast.emit("playerDisconnected", playerId);
  });
});

// WAŻNE: nasłuchiwanie na 0.0.0.0 zamiast domyślnego localhost
httpServer.listen(PORT, "0.0.0.0", () => {
  console.log(`Server listening on ${PORT}`);
});
