import express from "express";
import cors from "cors";
import listEndpoints from "express-list-endpoints";
import userRouter from "./services/users/index.js";
import chatRouter from "./services/chat/index.js";
//import RoomModel from "./room/model";
import {
  notFoundHandler,
  badRequestHandler,
  genericErrorHandler, 
} from "./errorHandlers.js";

// 🎗️ Use npm run dev to utilise app

const app = express(); // Initializes the express app.

// *********** //

// MIDDLEWARES GO HERE

app.use(cors());
app.use(express.json());

// *********** //

// 🎗️ Use npm run watch to utilise __tests__

app.get("/test", (req, res) => {
  res.status(200).send({ message: "Test success" });
});

// *********** //

// SOCKET GOES HERE (.get)

app.get("/online-users", (req, res) => {
  res.status(200).send({ onlineUsers: shared.onlineUsers });
});

// app.get("/rooms/:name", async (req, res) => {
//   const room = await RoomModel.findOne({ room: req.params.name });

//   res.send(room.chatHistory);
// });

// *********** //

// ROUTERS GO HERE 

app.use("/users", userRouter);
// app.use('/chats', chatRouter)

// *********** //

// ERROR HANDLERS GO HERE

app.use(notFoundHandler);
app.use(badRequestHandler);
app.use(genericErrorHandler);

// *********** //

console.table(listEndpoints(app));

export default app;
