import express from "express";
import createHttpError from "http-errors";
import q2m from "query-to-mongo";
import multer from "multer";
import { JWTAuthMiddleware } from "../../auth/index.js";
import { generateTokens, refreshTokens } from "../../auth/tools.js";
import { mediaStorage } from "../../utils/mediaStorage.js";
import UserModel from "./schema.js";

const userRouter = express.Router();

// Search users by username or email.
userRouter.get("/", async (req, res, next) => {
  try {
    if (req.query.name !== undefined || req.query.email !== undefined) {
      const query = q2m(req.query);
      const { total, users } = await UserModel.findUsers(query);
      const safeUsers = users;
      // safeUsers.map((user) => (user.refreshToken = undefined));
      console.log(safeUsers);
      res.send({
        links: query.links("/users", total),
        total,
        users,
        pageTotal: Math.ceil(total / query.options.limit),
      });
      console.log("USERS SENT🙌");
    } else {
      res.status(400).send("👻 Name or email must be queried!");
    }
  } catch (error) {
    next(error);
  }
});

// Returns your user data
userRouter.get("/me", JWTAuthMiddleware, async (req, res, next) => {
  try {
    res.send(req.user);
    console.log("USER SENT🙌");
  } catch (error) {
    next(error);
  }
});

// Changes your user data
userRouter.put("/me", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const filter = { _id: req.user._id };
    const update = { ...req.body };
    const updatedUser = await UserModel.findOneAndUpdate(filter, update, {
      returnOriginal: false,
    });
    await updatedUser.save();
    res.send(updatedUser);
    console.log("USER EDIT SUCCESSFUL🙌");
  } catch (error) {
    next(error);
  }
});

// Changes profile avatar
userRouter.post(
  "/me/avatar",
  JWTAuthMiddleware,
  multer({ storage: mediaStorage }).single("avatar"),
  async (req, res, next) => {
    try {
      const filter = { _id: req.user._id };
      const update = { ...req.body, avatar: req.file.path };
      const updatedUser = await UserModel.findOneAndUpdate(filter, update, {
        returnOriginal: false,
      });
      await updatedUser.save();
      res.send(updatedUser);
      console.log("PROFILE AVATAR CHANGE SUCCESSFUL🙌");
    } catch (error) {
      next(error);
    }
  }
);

// Returns a single user
userRouter.get("/:userId", async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const user = await UserModel.findById(userId);
    if (user) {
      // user.refreshToken = undefined;
      res.send(user);
      console.log("FOUND USER BY ID🙌");
    } else {
      res.status(404).send(`👻 User id ${userId} was not found!`);
      //next(createHttpError(404, `👻 User id ${userId} not found`));
    }
  } catch (error) {
    next(error);
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
      if (newUser) {
        const { accessToken, refreshToken } = await generateTokens(newUser);
        res.status(201).send({ _id, accessToken, refreshToken });
      }
    } else {
      res.status(422).send("👻 Duplicate emails can't be processed!");
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
    if (user !== null) {
      const { accessToken, refreshToken } = await generateTokens(user);
      res.send({ accessToken, refreshToken });
      console.log("USER LOGGED IN🙌");
    } else {
      res.status(401).send("👻 Something's wrong with your credentials!");
      //next(createHttpError(401, "👻 Something's wrong with your credentials"));
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
  } catch (err) {
    next(err);
  }
});

export default userRouter;
