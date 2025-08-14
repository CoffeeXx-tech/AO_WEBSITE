import { Server } from "socket.io";

const PORT = process.env.PORT || 3001; // Używa portu Render lub lokalnego 3001

const io = new Server(PORT, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("Nowy gracz podłączony:", socket.id);

  socket.on("playerMove", (data) => {
    socket.broadcast.emit("playerMoved", { id: socket.id, ...data });
  });

  socket.on("disconnect", () => {
    console.log("Gracz odłączony:", socket.id);
    socket.broadcast.emit("playerDisconnected", socket.id);
  });
});

console.log(`Server listening on port ${PORT}`);
