// USER
// name: string
// email: string
// avatar?: string

import mongoose from "mongoose";

const { Schema, model } = mongoose; 

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    avatar: { type: String },
    refreshToken: { type: String },
  },
  { timestamps: true }
);

export default model("User", userSchema);
