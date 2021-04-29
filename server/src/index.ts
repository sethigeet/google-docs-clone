import { createServer } from "http";
import { Server } from "socket.io";

import { connect } from "mongoose";

connect("mongodb://localhost/google-docs-clone", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("connected!");

  socket.on("get-document", (id) => {
    const content = "";
    socket.join(id);
    socket.emit("load-document", content);

    socket.on("send-changes", (data) => {
      socket.broadcast.to(id).emit("receive-changes", data);
    });
  });
});

httpServer.listen(3001);
