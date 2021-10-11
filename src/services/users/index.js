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

import express from "express";
import createHttpError from "http-errors";
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
    const newUser = new UserModel(req.body);
    const users = await UserModel.find();
    if (users.findIndex((u) => u.email === newUser.email) === -1) {
      const { _id } = await newUser.save();
      console.log("NEW USER SAVED🙌");
      // ✏️ Test endpoint returns 422 if Email is a Duplicate
      if (newUser) {
        const { accessToken, refreshToken } = await generateTokens(newUser);
        res.status(201).send({ _id, accessToken, refreshToken });
      }
    } else {
      res.status(422).send({ error: "Duplicate emails cannot be processed" });
    }
  } catch (err) {
    next(err);
  }
});

// Login
userRouter.post("/session", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.checkCredentials(email, password);
    if (user) {
      const { accessToken, refreshToken } = await generateTokens(user);
      res.send({ accessToken, refreshToken });
      console.log("USER LOGGED IN🙌");
      // ✏️ Test endpoint returns 401 if wrong credentials supplied
    } else {
      next(createHttpError(401, "☠️ Something is wrong with your credentials"));
    }
  } catch (err) {
    next(err);
  }
});

// Logout.
// If implemented with cookies, should set an empty cookie. Otherwise it should just remove the refresh token from the DB.
userRouter.delete("/session", JWTAuthMiddleware, async (req, res, next) => {
  try {
    req.user.refreshToken = null;
    await req.user.save();
    res.send();
    console.log("USER LOGGED OUT🙌");
    // ✏️ Test endpoint nullifies refreshToken saved in DB
  } catch (err) {
    next(err);
  }
});

// Refresh session
userRouter.post("/session/refresh", async (req, res, next) => {
  try {
    const { actualRefreshToken } = req.body;
    const { accessToken, refreshToken } = await refreshTokens(
      actualRefreshToken
    );
    res.send({ accessToken, refreshToken });
    console.log("SESSION REFRESHED🙌");
    // ✏️ Test endpoint returns 401 if refresh token not valid
  } catch (err) {
    next(err);
  }
});

export default userRouter;
