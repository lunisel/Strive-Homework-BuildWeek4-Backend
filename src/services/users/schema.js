// USER
// name: string
// email: string
// avatar?: string

import mongoose from "mongoose";
import bcrypt from "bcrypt";

const { Schema, model } = mongoose; 

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    avatar: { type: String },
    refreshToken: { type: String },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
    const newUser = this;
    const plainPW = newUser.password;
    if (newUser.isModified("password")) {
      newUser.password = await bcrypt.hash(plainPW, 11);
      next();
    }
  });

  userSchema.methods.toJSON = function () {
    const userDoc = this;
    const userObj = userDoc.toObject();
    delete userObj.password;
    delete userObj.__v;
    return userObj;
  };

export default model("User", userSchema);
