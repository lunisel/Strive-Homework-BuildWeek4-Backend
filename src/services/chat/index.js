// GET /chats
// Returns all chats in which you are a member

// POST /chats
// If there is only one user in the members list: this endpoint should check if the request sender 
// already had an active chat with this user and return it if present.
// Otherwise, it creates a new chat among the request sender and the members listed in the request body. 
// When this happens, on the socket layer, this endpoint should also make sure that the sockets of all 
// the members (including the request sender) are joining this newly created room (otherwise none of them 
// would be listening to incoming messages to this room).

// GET /chats/{id}
// Returns full message history for a specific chat

// POST /chats/{id}/image
// Changes group chat picture. Request sender MUST be a member of the chat

import express from "express";

const chatRouter = express.Router();

chatRouter.get("/", async (req, res, next) => {
  try {
    console.log("Hi Chats👋");
  } catch (err) {
    next(err);
  }
});

export default chatRouter;
