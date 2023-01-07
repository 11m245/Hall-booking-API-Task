import { client } from "../hallbookingTask.js";
const initialRoomId = 100;

export async function allRooms() {
  return await client.db("tasks").collection("rooms").find({}).toArray();
}

export async function getBookedRooms() {
  return await client
    .db("tasks")
    .collection("roomsBookedHistory")
    .find({ isCheckedOut: false })
    .sort({ roomId: 1 })
    .toArray();
}
export async function getBookedCustomers() {
  return await client
    .db("tasks")
    .collection("roomsBookedHistory")
    .find({ isCheckedOut: false })
    .sort({ customerName: 1 })
    .toArray();
}
async function getLastRoomId() {
  const roomsArray = await client
    .db("tasks")
    .collection("rooms")
    .find({})
    .toArray();
  if (roomsArray.length === 0) {
    return initialRoomId;
  } else {
    return roomsArray[roomsArray.length - 1].roomId;
  }
}
export async function addRoom(data) {
  const lastRoomId = await getLastRoomId();
  console.log("lastRoomId is", lastRoomId);
  const formattedRoomData = {
    ...data,
    roomId: lastRoomId + 1,
    isBlocked: false,
  };

  return await client
    .db("tasks")
    .collection("rooms")
    .insertOne(formattedRoomData);
}

async function getConflictBookings({
  roomId: crRoomId,
  startTime: crStart,
  endTime: crEnd,
}) {
  const result = client
    .db("tasks")
    .collection("roomsBookedHistory")
    .find({
      $or: [
        {
          roomId: crRoomId,
          isCheckedOut: false,
          startTime: { $lte: crStart },
          endTime: { $gt: crStart },
        },
        {
          roomId: crRoomId,
          isCheckedOut: false,
          startTime: { $gte: crEnd },
          endTime: { $lt: crEnd },
        },
        {
          roomId: crRoomId,
          isCheckedOut: false,
          $and: [
            { startTime: { $gte: crStart } },
            { startTime: { $lt: crEnd } },
          ],
        },
      ],
    })
    .toArray();

  return result;
}

export async function bookRoom(data) {
  const { customerName, date, start, end, roomId } = data;
  const formattedData = {
    customerName: customerName,
    startTime: parseInt(date) + start * 3600,
    endTime: parseInt(date) + end * 3600,
    roomId: roomId,
    isCheckedOut: false,
    createdAt: "",
    updatedAt: "",
  };
  const conflictBookings = await getConflictBookings(formattedData);
  console.log("conflict data", conflictBookings);
  if (conflictBookings.length !== 0) {
    return { message: "booking not done due to booking conflicts" };
  } else {
    return await client
      .db("tasks")
      .collection("roomsBookedHistory")
      .insertOne({ ...formattedData, createdAt: Date.now(), updatedAt: "" });
  }
}
