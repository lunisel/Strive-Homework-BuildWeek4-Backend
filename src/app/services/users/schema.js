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
    status: { type: String },
    avatar: {
      type: String,
      default: "http://tny.im/q74",
    },
    refreshToken: { type: String },
  },
  { timestamps: true }
);

userSchema.static("findUsers", async function (query) {
  const criteria = query.criteria;
  const name = criteria.name
  const email = criteria.email
  console.log(criteria);
  // cannot remember how to make this case insensitive etc.......
  const searchTerm =
    criteria.name !== undefined
      ? { name }
      : { email };
  console.log(searchTerm);
  // var thename = "Andrew";
  // db.collection.find({ name: /^thename$/i });
  const total = await this.countDocuments(searchTerm);
  const users = await this.find(searchTerm, query.options.fields)
    .limit(query.options.limit)
    .skip(query.options.skip)
    .sort(query.options.sort);
  return { total, users };
});

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
  delete userObj.refreshToken;
  delete userObj.__v;
  return userObj;
};

userSchema.statics.checkCredentials = async function (email, plainPW) {
  const user = await this.findOne({ email });
  if (user) {
    const isMatch = await bcrypt.compare(plainPW, user.password);
    if (isMatch) return user;
    else return null;
  } else {
    return null;
  }
};

export default model("User", userSchema);
