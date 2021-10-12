// GET /chats
// Returns all chats in which you are a member

// GET /chats/{id}
// Returns full message history for a specific chat

// POST /chats/{id}/image
// Changes group chat picture. Request sender MUST be a member of the chat

import express from "express";
import multer from "multer";
import { JWTAuthMiddleware } from "../../auth/index.js";
import { mediaStorage } from "../../utils/mediaStorage.js";
import ChatModel from "./schema.js";

const chatRouter = express.Router();

chatRouter.get("/", async (req, res, next) => {
  try {
    console.log("Hi Chats👋");
  } catch (err) {
    next(err);
  }
});

chatRouter.post("/", JWTAuthMiddleware, async (req, res, next) => {
  // If there is only one user in the members list: this endpoint should check if the request sender
  // already had an active chat with this user and return it if present.

  // Otherwise, it creates a new chat among the request sender and the members listed in the request body.

  // When this happens, on the socket layer, this endpoint should also make sure that the sockets of all
  // the members (including the request sender) are joining this newly created room (otherwise none of them
  // would be listening to incoming messages to this room).

  try {
    // I can either click on a User to chat with them

    // Or I can click on a pre-existing Chat

    // If Chat is pre-existing I add my message to its history
    // thus I would need the chat _id

    // Else if chat does not exist yet I need to create a new chat
    // return its _id
    // and add my message to its history.

    // ? Additional method may be required to add a User to a pre-existing chat, let's check

    // we are sending a message using req.body

    // message looks like this

    // {
    //   sender: req.user._id, // get this from JWTAuthMiddleware
    //   content: {
    //     text: "...",
    //     media: "...", // if file attached include cloudinary link here, otherwise leave empty
    //   },
    // },

    // when posting this message must be attached to a CHAT

    // {
    //   _id: will be created when posting
    //   members: [ at minimum will include our ID and other person ID ], // so, we need to include person ID in our req.body as well
    //   name: { not compulsory, we can rename chat at frontend },
    //   history: { default: [], push new message each time posting },
    //   image: { not compulsory, can be added at frontend, backend endpoint to change is POST /chats/{id}/image },
    // },
    
  } catch (err) {
    next(err);
  }
});

export default chatRouter;
