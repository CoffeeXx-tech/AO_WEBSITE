import { createServer } from "http";
import { Server } from "socket.io";
import { nanoid } from "nanoid";

const PORT = process.env.PORT || 3001;

// Twój prosty HTTP server (zwraca tekst, żeby Render/Heroku wiedział, że działa)
const httpServer = createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Server działa\n");
});

// Socket.IO z CORS
const io = new Server(httpServer, {
  cors: {
    origin: "*",       // pozwala połączyć się z dowolnego frontendu
    methods: ["GET", "POST"]
  }
});

// mapa wszystkich graczy
const players = new Map();

io.on("connection", (socket) => {
  console.log("Nowy gracz podłączony:", socket.id);

  // tworzymy nowego gracza, x = liczba graczy * 2
  const xOffset = players.size * 2;
  const playerId = nanoid(8);
  const player = { id: playerId, x: xOffset, y: 0, z: 0 };
  players.set(playerId, player);

  // powiadamiamy podłączonego gracza o wszystkich graczach
  socket.emit("welcome", { id: playerId, snapshot: Array.from(players.values()) });

  // powiadamiamy innych
  socket.broadcast.emit("player_joined", player);

  // odbieramy ruch gracza
  socket.on("playerMove", (data) => {
    const p = players.get(playerId);
    if (!p) return;
    p.x = data.x;
    p.y = data.y;
    p.z = data.z;

    // wysyłamy stan wszystkim graczom
    io.emit("state", Array.from(players.values()));
  });

  socket.on("disconnect", () => {
    console.log("Gracz odłączony:", socket.id);
    players.delete(playerId);
    socket.broadcast.emit("playerDisconnected", playerId);
  });
});

httpServer.listen(PORT, () => console.log(`Server listening on :${PORT}`));
