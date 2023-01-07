import express from "express";
import {
  addRoom,
  allRooms,
  getBookedRooms,
  getBookedCustomers,
} from "../services/rooms.service.js";
const router = express.Router();

router.get("/", async function (request, response) {
  const result = await allRooms();
  // console.log(result);
  response.send(result);
});
router.post("/addRoom", async function (request, response) {
  const data = request.body;
  // console.log(data);
  const result = await addRoom(data);
  response.send(result);
});

router.get("/bookedRooms", async function (request, response) {
  const result = await getBookedRooms();
  response.send(result);
});
router.get("/bookedCustomers", async function (request, response) {
  const result = await getBookedCustomers();
  response.send(result);
});
export default router;
