import server from "./server.js";
import mongoose from "mongoose";

const port = process.env.PORT || 3001;
const mongoUrl = process.env.MONGO_URL;

mongoose
  .connect(mongoUrl, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("🤟 _Connected!");
    server.listen(port, () => {
      console.log("📞 _Server listening on port " + port);
    });
  });