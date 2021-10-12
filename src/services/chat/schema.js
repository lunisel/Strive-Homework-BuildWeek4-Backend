// CHAT
// members: User[]
// name?: string
// history: Message[]
// image?: string

// MESSAGE
// sender: User
// content: {
// 	text?: string
// 	media?: string
// }
// timestamp: number

import mongoose from "mongoose";

const { Schema, model } = mongoose;

const messageSchema = new Schema(
  {
    sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: {
      text: { type: String },
      media: { type: String },
    },
  },
  {
    timestamps: false,
  }
);

const chatSchema = new Schema(
  {
    members: [{ type: Schema.Types.ObjectId, ref: "User" }],
    name: { type: String },
    history: { default: [], type: [messageSchema] },
    image: { type: String },
  },
  { timestamps: true }
);

chatSchema.methods.toJSON = function () {
  const userDoc = this;
  const userObj = userDoc.toObject();
  delete userObj.__v;
  return userObj;
};

export default model("Chat", chatSchema);
