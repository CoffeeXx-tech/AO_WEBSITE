import { Server } from "socket.io";

const io = new Server(3001, {
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
