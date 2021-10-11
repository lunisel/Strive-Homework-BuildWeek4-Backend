// GET /users
// Search users by username or email.

// GET /users/me
// Returns your user data

// PUT /users/me
// Changes your user data

// POST /users/me/avatar
// Changes profile avatar

// GET /users/{id}
// Returns a single user

// POST /users/account
// Registration

// POST /users/session
// Login

// DELETE /users/session
// Logout. If implemented with cookies, should set an empty cookie. Otherwise it should just remove the refresh token from the DB.

// POST /users/session/refresh
// Refresh session

import express from "express";
import { JWTAuthMiddleware } from "../../auth/index.js";
import { generateTokens, refreshTokens } from "../../auth/tools.js";
import UserModel from "./schema.js";

const userRouter = express.Router();

userRouter.get("/", async (req, res, next) => {
  try {
    console.log("Hi Users👋");
  } catch (err) {
    next(err);
  }
});

// Registration
userRouter.post("/account", async (req, res, next) => {
  try {
    console.log("REGISTER USER🤸");
    const newUser = new UserModel(req.body);
    const { _id } = await newUser.save();
    if (newUser) {
      console.log("NEW USER SAVED🙌");
      const { accessToken, refreshToken } = await generateTokens(newUser);
      res.status(201).send({ _id, accessToken, refreshToken });
    }
  } catch (err) {
    next(err);
  }
});

// Login
userRouter.post("/session", async (req, res, next) => {
  try {
    console.log("Hi Users👋");
  } catch (err) {
    next(err);
  }
});

// Logout. If implemented with cookies, should set an empty cookie. Otherwise it should just remove the refresh token from the DB.
userRouter.delete("/session", async (req, res, next) => {
  try {
    console.log("Hi Users👋");
  } catch (err) {
    next(err);
  }
});

// Refresh session
userRouter.post("/session/refresh", async (req, res, next) => {
  try {
    console.log("Hi Users👋");
  } catch (err) {
    next(err);
  }
});

export default userRouter;
