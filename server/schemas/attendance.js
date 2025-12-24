const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const attendanceSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  date: { type: Date, required: true },
  checkIn: { type: Date },
  checkOut: { type: Date },
  status: { type: String, enum: ["present", "absent", "leave", "holiday"], default: "present" }
});

module.exports = mongoose.model("Attendance", attendanceSchema);
