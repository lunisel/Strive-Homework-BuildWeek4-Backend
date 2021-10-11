import express from "express";
import cors from "cors";
import listEndpoints from "express-list-endpoints";
import userRouter from "./services/users/index.js";
import chatRouter from "./services/chat/index.js";

const server = express();

// 🎗️ Use npm run dev to utilise

// *********** //

// MIDDLEWARES GO HERE

server.use(cors());
server.use(express.json());

// *********** //

server.get("/test", (req, res) => {
  res.status(200).send({ message: "Test success" });
});

// *********** //

server.use("/users", userRouter);
server.use("/chats", chatRouter);

// USER, CHAT ROUTERS GO HERE

// *********** //

// *********** //

// ERROR HANDLERS GO HERE

// *********** //

console.table(listEndpoints(server));

export default server;
