import mongoose from "mongoose";
import { createServer } from "http";
import { Server } from "socket.io";
// import RoomModel from './app/room/model'
import app from "./app/index.js";

const httpServer = createServer(app);

// initializing our socket.io server....
const io = new Server(httpServer, { allowEIO3: true });

io.on("connection", (socket) => {
  console.log("🚀 _Connected to socket-io!_" + socket.id);

  socket.on("joinRooms", ({ id }) => {
    socket.join(id);
    console.log("Connected in rooms", socket.rooms);
    // shared.onlineUsers.push({ username, id: socket.id, room });
    socket.emit("joinedRoom");
    // socket.broadcast.emit("newConnection");
  });

  socket.on("sendmessage", async ({ message, room }) => {
    // const { text, sender, id, timestamp } = message

    // ... we should save the message to the database here...

    // await RoomModel.findOneAndUpdate(
    //   { room },
    //   {
    //     $push: { chatHistory: message },
    //   }
    // );

    // ... and then broadcast the message to the recipient(s)
    // socket.broadcast.emit("message", message)
    socket.to(room).emit("message", message);
  });

  socket.on("disconnect", () => {
    console.log("💤 _Disconnected socket-io!_" + socket.id);
    // shared.onlineUsers = shared.onlineUsers.filter(
    //   (user) => user.id !== socket.id
    // );
    // socket.broadcast.emit("newConnection");
  });
});

// Now listening...

const port = process.env.PORT || 3001;
const mongoUrl = process.env.MONGO_URL;

if (!mongoUrl) {
  throw new Error("No Mongo url defined.");
}

mongoose.connect(mongoUrl).then(() => {
  console.log("🤟 _Connected to Mongo @index.js!");
  httpServer.listen(port, () => {
    console.log("📞 _Server listening on port " + port);
  });
});
