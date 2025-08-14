import { createServer } from "http";
import { Server } from "socket.io";

const PORT = process.env.PORT || 3001;

const httpServer = createServer((req, res) => {
  res.writeHead(200);
  res.end("Server is running");
});

const io = new Server(httpServer, {
  cors: { origin: "*" },
});

io.on("connection", (socket) => {
  console.log("Nowy gracz podłączony:", socket.id);
});

httpServer.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
