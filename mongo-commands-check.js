db.roomsBookedHistory.find({
  isCheckedOut: false,
  startTime: { $lte: crStart },
  endTime: { $gt: crStart },
});

db.roomsBookedHistory.find({
  isCheckedOut: false,
  startTime: { $gte: crEnd },
  endTime: { $lt: crEnd },
});

db.roomsBookedHistory.find({
  isCheckedOut: false,
  $and: [{ startTime: { $gte: crStart } }, { startTime: { $lt: crEnd } }],
});

// temp combined
db.roomsBookedHistory.find({
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
      $and: [{ startTime: { $gte: crStart } }, { startTime: { $lt: crEnd } }],
    },
  ],
});

//change to values
db.roomsBookedHistory.find({
  $or: [
    {
      isCheckedOut: false,
      startTime: { $lte: 1672788600 },
      endTime: { $gt: 1672788600 },
    },
    {
      isCheckedOut: false,
      startTime: { $gte: 1672795800 },
      endTime: { $lt: 1672795800 },
    },
    {
      isCheckedOut: false,
      $and: [
        { startTime: { $gte: 1672788600 } },
        { startTime: { $lt: 1672795800 } },
      ],
    },
  ],
});
