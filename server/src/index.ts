import { createServer } from "http";
import { Server } from "socket.io";

import { connect } from "mongoose";

import { Document } from "./models";
import { findOrCreateDocument } from "./utils";

connect("mongodb://localhost/google-docs-clone", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

const httpServer = createServer();
const io = new Server(httpServer, {
  path: "/socket",
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("connected!");

  socket.on("get-document", async (documentId) => {
    const document = await findOrCreateDocument(documentId);
    socket.join(documentId);
    socket.emit("load-document", (document as any).data);

    socket.on("send-changes", (data) => {
      socket.broadcast.to(documentId).emit("receive-changes", data);
    });

    socket.on("save-document", async (data) => {
      await Document.findByIdAndUpdate(documentId, { data });
    });
  });
});

httpServer.listen(3001, () => console.log("Started server on port 3001"));
