import express from "express";
import multer from "multer";
import { JWTAuthMiddleware } from "../../auth/index.js";
import { mediaStorage } from "../../utils/mediaStorage.js";
import ChatModel from "./schema.js";

const chatRouter = express.Router();

// Returns all chats in which you are a member
chatRouter.get("/", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const chats = await ChatModel.find();
    const filteredChats = chats.filter((c) => c.members.includes(req.user._id));
    res.send(filteredChats);
    console.log("FETCHED CHAT HISTORY🙌");
  } catch (err) {
    next(err);
  }
});

// If there is only one user in the members list: this endpoint should check if the request sender
// already had an active chat with this user and return it if present.

// Otherwise, it creates a new chat among the request sender and the members listed in the request body.

// When this happens, on the socket layer, this endpoint should also make sure that the sockets of all
// the members (including the request sender) are joining this newly created room (otherwise none of them
// would be listening to incoming messages to this room).
chatRouter.post("/", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const { message } = req.body;
    const membersArray = req.body.members;
    membersArray.sort(); // sort array of members so it is always the same
    const myId = req.user._id;
    message.sender = myId;

    // Check: is there already a chat between array of members + req.user._id?
    const foundChat = await ChatModel.findOne({
      members: [...membersArray, myId],
    });
    if (foundChat) {
      // If Chat is pre-existing add user message to its history
      const chatId = foundChat._id;
      const filter = { chatId };
      const newHistory = [...foundChat.history, message];
      const update = { history: newHistory };
      console.log(filter, update);
      const updatedChat = await ChatModel.findOneAndUpdate(filter, update, {
        returnOriginal: false,
      });
      await updatedChat.save();
      res.send(updatedChat);
      console.log("CHAT HISTORY UPDATED SUCCESSFULLY🙌");
    } else {
      // Else we create a new chat
      // ❗ WE NEED TO IMPLEMENT MEDIA UPLOAD CAPACITY
      const newChat = await ChatModel({
        members: [...membersArray, myId],
        history: [message],
      });
      await newChat.save();
      console.log("NEW CHAT SAVED🙌");
      console.log(newChat.history[0]);
      res.status(201).send({ _id: newChat._id });
    }
    // ❓ Additional method may be required to add a User to a pre-existing chat, let's check
  } catch (err) {
    next(err);
  }
});

// GET /chats/{id}
// Returns full message history for a specific chat
chatRouter.get("/:chatId", async (req, res, next) => {
  try {
    const chatId = req.params.chatId;
    const chat = await ChatModel.findById(chatId);
    if (chat) {
      res.send(chat.history);
      console.log("FOUND CHAT BY ID🙌");
    } else {
      res.status(404).send(`👻 Chat id ${chatId} was not found!`);
    }
  } catch (error) {
    next(error);
  }
});

// POST /chats/{id}/image
// Changes group chat picture. Request sender MUST be a member of the chat
chatRouter.post( 
  "/:chatId/image",
  JWTAuthMiddleware,
  multer({ storage: mediaStorage }).single("image"),
  async (req, res, next) => {
    try {
      const { chatId } = req.params;
      const chat = await ChatModel.findById(chatId);
      if (chat.members.includes(req.user._id)) {
        const filter = { _id: chatId };
        const update = { ...req.body, image: req.file.path };
        const updatedChat = await ChatModel.findOneAndUpdate(filter, update, {
          returnOriginal: false,
        });
        await updatedChat.save();
        res.send(updatedChat);
        console.log("CHAT IMAGE CHANGE SUCCESSFUL🙌");
      } else {
        // members must include req.user._id
        res.status(404).send(`👻 User not authorized to update chat with id ${userId}!`);
      }
    } catch (error) {
      next(error);
    }
  }
);

export default chatRouter;
