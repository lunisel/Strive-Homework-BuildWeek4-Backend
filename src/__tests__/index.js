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

  const michael = {
    name: "Michael",
    email: "m.scott@dundermifflin.com",
    password: "holly",
  };

  const dwight = {
    name: "Dwight",
    email: "d.schrute@dundermifflin.com",
    password: "beets",
  };

  const jim = {
    name: "Jim",
    email: "j.halpert@dundermifflin.com",
    password: "pamela",
  };

  const pam = {
    name: "Pam",
    email: "p.beasley@dundermifflin.com",
    password: "arty",
  };

  const angela = {
    name: "Angela",
    email: "a.martin@dundermifflin.com",
    password: "sprinkles",
  };

  const ryan = {
    name: "Ryan",
    email: "info@WUPHF.com",
    password: "me",
  };

  const creed = {
    name: "Creed",
    email: "c.bratton@dundermifflin.com",
    password: "chairs",
  };

  it("should test that GET /users (1) returns correct length array, (2) refresh tokens undefined", async () => {
    await request.post("/users/account").send({
      name: "TestUser",
      email: "joe.blo1@gmail.com",
      password: "password",
    });
    await request.post("/users/account").send({
      name: "TestUser",
      email: "joe.blo2@gmail.com",
      password: "password",
    });
    const response = await request.get("/users?name=TestUser");
    expect(response.body.users[0].refreshToken).not.toBeDefined();
    expect(response.body.users[1].refreshToken).not.toBeDefined();
    expect(response.body.users.length).toEqual(2);
  });

  it("should test that GET /users/me returns (1) user corresponding to _id, (2) password field undefined, (3) refresh token undefined", async () => {
    const newAccount = await request.post("/users/account").send(michael);
    const { _id, accessToken } = newAccount.body;
    const response = await request
      .get("/users/me")
      .set({ Authorization: `Bearer ${accessToken}` });
    expect(response.body._id).toEqual(_id);
    expect(response.body.password).not.toBeDefined();
    expect(response.body.refreshToken).not.toBeDefined();
  });

  it("should test that GET /users/me returns 500 if wrong access token provided", async () => {
    const response = await request
      .get("/users/me")
      .set({ Authorization: `Bearer IsTh1sAFakeAccessTok3n?` });
    expect(response.status).toBe(500); // should it be a different error code
  });

  it("should test that PUT /users/me returns updated user with new name", async () => {
    const newAccount = await request.post("/users/account").send(dwight);
    const { accessToken } = newAccount.body;
    const fakeName = "Dwigt Scrott";
    const response = await request
      .put("/users/me")
      .send({ name: fakeName })
      .set({ Authorization: `Bearer ${accessToken}` });
    expect(response.body.name).toEqual(fakeName);
  });

  // it("should test that POST /users/me/avatar returns avatar with cloudinary string", async () => {
  //   const newAccount = await request.post("/users/account").send(pam).set({});
  //  HOW TO MOCK MULTER IN SUPERTEST??
  // })

  it("should test that GET /users/{id} returns (1) user with corresponding _id, (2) password field undefined, (3) refresh token undefined", async () => {
    const michaelAccount = await request.post("/users/account").send(michael);
    const schruteAccount = await request.post("/users/account").send(dwight);
    const schruteId = schruteAccount.body._id;
    const { accessToken } = michaelAccount.body;
    const response = await request
      .get("/users/" + schruteId)
      .set({ Authorization: `Bearer ${accessToken}` });
    expect(response.body._id).toEqual(schruteId);
    expect(response.body.password).not.toBeDefined();
    expect(response.body.refreshToken).not.toBeDefined();
  });

  it("should test that POST /users/account returns 422 if email duplicated", async () => {
    await request.post("/users/account").send(dwight);
    const response = await request.post("/users/account").send({
      name: "Creed Bratton",
      email: "d.schrute@dundermifflin.com",
      password: "scranton",
    });
    expect(response.status).toBe(422);
  });

  it("should test that POST /users/session returns 401 if wrong credentials supplied", async () => {
    await request.post("/users/account").send(ryan);
    const response = await request
      .post("/users/session")
      .send({ email: "info@WUPHF.com", password: "wr0ngPa5sword" });
    expect(response.status).toBe(401); // ❗ FAILED, actually getting 500
  });

  it("should test that DELETE /users/session returns 200", async () => {
    const newAccount = await request.post("/users/account").send(angela);
    const { accessToken } = newAccount.body;
    console.log(accessToken);
    const response = await request
      .delete("/users/session")
      .set({ Authorization: `Bearer ${accessToken}` });
    expect(response.status).toBe(200);
  });

  it("should test that POST /users/session/refresh returns 200 if refresh token valid", async () => {
    const newAccount = await request.post("/users/account").send(jim);
    const { refreshToken } = newAccount.body;
    const response = await request
      .post("/users/session/refresh")
      .send({ actualRefreshToken: refreshToken });
    expect(response.status).toBe(200);
  });

  // *********** //

  // IMPLEMENT TESTS FOR CHAT

  it("should test that GET /chats returns only chats in which you are a member", async () => {
    // first, create three users
    const user1 = await request.post("/users/account").send(pam);
    const { accessToken } = user1.body;
    const user2 = await request.post("/users/account").send(creed);
    const { _id } = user2.body;
    const user3 = await request.post("/users/account").send({
      name: "TestUser",
      email: "joe.blo3@gmail.com",
      password: "password",
    });
    const user3AccessToken = user3.body.accessToken;
    // second, create a chat between first two users
    const message = {
      members: [_id], // => user2 id
      message: {
        content: {
          text: "Random",
        },
      },
    };
    await request
      .post("/chats")
      .send(message)
      .set({ Authorization: `Bearer ${accessToken}` }); // => user1 access token
    // third, get chats using GET "/chats" endpoint as third user
    const response = await request
      .get("/chats")
      .set({ Authorization: `Bearer ${user3AccessToken}` }); // => user3 access token
    expect(response.body.length).toBe(0);
  });

  //it("should test that POST /chats .... DOES WHAT ? .... ");
  // POST /chats
  // If there is only one user in the members list: this endpoint should check if the request sender
  // already had an active chat with this user and return it if present.
  // Otherwise, it creates a new chat among the request sender and the members listed in the request body.
  // When this happens, on the socket layer, this endpoint should also make sure that the sockets of all
  // the members (including the request sender) are joining this newly created room (otherwise none of them
  // would be listening to incoming messages to this room).

  it("should test that GET /chats/{ID} returns chat with corresponding id", async () => {
    // first, create two users
    const user1 = await request.post("/users/account").send({
      name: "TestUser",
      email: "joe.blo4@gmail.com",
      password: "password",
    });
    const { accessToken } = user1.body;
    const user2 = await request.post("/users/account").send({
      name: "TestUser",
      email: "joe.blo5@gmail.com",
      password: "password",
    });
    const { _id } = user2.body;
    // second, create chat between users
    const message = {
      members: [_id], // => user2 id
      message: {
        content: {
          text: "Random",
        },
      },
    };
    const newChat = await request
      .post("/chats")
      .send(message)
      .set({ Authorization: `Bearer ${accessToken}` }); // => user1 access token
    const chatId = newChat._id;
    // third, get chat using GET "/chats/{ID}" endpoint
    const response = await request.get("/chats/" + chatId);
    expect(response._id).toEqual(chatId);
  });

  it("should test that POST /chats/{ID}/image returns 404 if sender is not a member of the chat", async () => {
    // first, create three users
    const user1 = await request.post("/users/account").send({
      name: "TestUser",
      email: "joe.blo6@gmail.com",
      password: "password",
    });
    const { accessToken } = user1.body;
    const user2 = await request.post("/users/account").send({
      name: "TestUser",
      email: "joe.blo7@gmail.com",
      password: "password",
    });
    const { _id } = user2.body;
    const user3 = await request.post("/users/account").send({
      name: "TestUser",
      email: "joe.blo8@gmail.com",
      password: "password",
    });
    const user3AccessToken = user3.body.accessToken;
    // second, create chat between first two users
    const message = {
      members: [_id], // => user2 id
      message: {
        content: {
          text: "Random",
          image: "http://tny.im/q6k",
        },
      },
    };
    const newChat = await request
      .post("/chats")
      .send(message)
      .set({ Authorization: `Bearer ${accessToken}` }); // => user1 access token
    const chatId = newChat._id;
    // third, get chats using GET "/chats" endpoint as third user
    const response = await request
      .get("/chats/" + chatId)
      .set({ Authorization: `Bearer ${user3AccessToken}` });
    expect(response.status).toBe(404);
  });

  // *********** //
});
