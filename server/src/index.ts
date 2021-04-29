import { createServer } from "http";
import { Server } from "socket.io";

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("connected!");
  socket.on("send-changes", (data) => {
    socket.broadcast.emit("receive-changes", data);
  });
});

httpServer.listen(3001);
