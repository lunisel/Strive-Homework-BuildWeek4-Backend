import supertest from "supertest";
import server from "../server.js";
import dotenv from "dotenv";
import mongoose from "mongoose";

// 🎗️ Use npm run watch to utilise

dotenv.config();

const request = supertest(server);

describe("Testing the testing environment", () => {
  it("should test that true is true", () => {
    expect(true).toBe(true);
  });
});

describe("Testing the server", () => {
  beforeAll((done) => {
    mongoose.connect(process.env.MONGO_URL_TEST).then(() => {
      console.log("Connected to Atlas");
      done();
    });
  });

  afterAll((done) => {
    mongoose.connection.dropDatabase().then(() => {
      console.log("Test DB dropped");

      mongoose.connection.close().then(() => {
        done();
      });
    });
  });

  test("should test that the /test endpoint is OK", async () => {
    const response = await request.get("/test");
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Test success");
  });

  // *********** //

  // IMPLEMENT TESTS FOR USERS

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

  // *********** //

  // IMPLEMENT TESTS FOR CHAT

  // GET /chats
  // Returns all chats in which you are a member

  // POST /chats
  // If there is only one user in the members list: this endpoint should check if the request sender
  // already had an active chat with this user and return it if present.
  // Otherwise, it creates a new chat among the request sender and the members listed in the request body.
  // When this happens, on the socket layer, this endpoint should also make sure that the sockets of all
  // the members (including the request sender) are joining this newly created room (otherwise none of them
  // would be listening to incoming messages to this room).

  // GET /chats/{id}
  // Returns full message history for a specific chat

  // POST /chats/{id}/image
  // Changes group chat picture. Request sender MUST be a member of the chat

  // *********** //
});
