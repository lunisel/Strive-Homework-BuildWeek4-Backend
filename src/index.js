import mongoose from "mongoose";
import { createServer } from "http";
import { Server } from "socket.io";
// import RoomModel from './app/room/model'
import app from "./app/index.js";

const httpServer = createServer(app);

// initializing our socket.io server....
const io = new Server(httpServer, { allowEIO3: true }); 

io.on("connection", (socket) => {
  console.log("🚀 _Connected to socket-io!", socket.id);

  // socket.on("setUsername", ({ username, room }) => {
  //   console.log("Connected at username", username);

  //   // Rooms are a server-side concept which allows socket to send a message only
  //   // to some recipients who previously "joined" that room
  //   socket.join(room);

  //   // By default, when a socket is connecting, it's joining a room with the same id as its socket id
  //   console.log("Connected in rooms", socket.rooms);

  //   shared.onlineUsers.push({ username, id: socket.id, room });

  //   socket.emit("loggedin");
  //   socket.broadcast.emit("newConnection");
  // });

  // socket.on("sendmessage", async ({ message, room }) => {
  //   // const { text, sender, id, timestamp } = message

  //   // ... we should save the message to the database here...

  //   await RoomModel.findOneAndUpdate(
  //     { room },
  //     {
  //       $push: { chatHistory: message },
  //     }
  //   );

  //   // ... and then broadcast the message to the recipient(s)
  //   // socket.broadcast.emit("message", message)
  //   socket.to(room).emit("message", message);
  // });

  socket.on("disconnect", () => {
    console.log("💤 _Disconnected to socket-io!");
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
