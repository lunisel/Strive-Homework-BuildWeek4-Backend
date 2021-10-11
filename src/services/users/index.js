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

const userRouter = express.Router();

userRouter.get("/", async (req, res, next) => {
  try {
    console.log("Hi Users👋");
  } catch (err) {
    next(err);
  }
});

export default userRouter;
