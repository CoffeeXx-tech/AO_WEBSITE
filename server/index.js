import { createServer } from "http";
import { Server } from "socket.io";

const PORT = process.env.PORT || 3001; // <- ważne, używamy PORT z Render

const httpServer = createServer(); // HTTP server
const io = new Server(httpServer, { cors: { origin: "*" } });

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

httpServer.listen(PORT, () => console.log(`Server listening on :${PORT}`));
