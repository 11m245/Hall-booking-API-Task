import { bookRoom } from "./services/rooms.service.js";
import roomsRouter from "./routes/rooms.route.js";
import express from "express";
import * as dotenv from "dotenv";
import { MongoClient } from "mongodb";
dotenv.config();

const app = express();
const PORT = process.env.PORT;
app.use(express.json());

const MONGO_URL = process.env.MONGO_URL;
export const client = new MongoClient(MONGO_URL);
await client.connect();
console.log("mongo connected");

app.get("/", function (request, response) {
  response.send(
    "welcome to hallbooking api, here in backend epoch time is used"
  );
});

app.use("/rooms", roomsRouter);

app.post("/bookRoom", async function (request, response) {
  const data = request.body;
  // console.log(data);
  const result = await bookRoom(data);
  response.send(result);
});

app.listen(PORT, () => console.log("app started in port", PORT));
