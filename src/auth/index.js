import createHttpError from "http-errors";
import { verifyJWT } from "./tools.js";
import UserModel from "../services/users/schema.js";

export const JWTAuthMiddleware = async (req, res, next) => {
  if (!req.headers.authorization) {
    next(
      createHttpError(
        401,
        "Please provide credentials in Authorization header!"
      )
    );
  } else {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const decodedToken = await verifyJWT(token);
      const user = await UserModel.findById(decodedToken._id);
      if (user) {
        req.user = user;
        next();
      } else {
        next(createHttpError(404, "User not found!"));
      }
    } catch (err) {
      next(createHttpError(401, "Token not valid"));
    }
  }
};

// export const allowOnlyHosts = (req, res, next) => {
//     if (req.user.role === "Host") {
//       console.log("USER ROLE === HOST")
//       next();
//     } else {
//       next(createHttpError(403, "Hosts only!"));
//     }
//   };
