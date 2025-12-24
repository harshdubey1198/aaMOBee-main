const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DemoUserEntrySchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    mobile: {
      countryCode: { type: String, required: true },
      number: { type: String, required: true },
    },
    role:{type:String},
    isDemoUser: { type: Boolean, default: true },
    token: { type: String },
    expiresAt: { type: Date, required: true },
    activityLogs: [
      {
        route: { type: String },
        action: { type: String },
        timestamp: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

const DemoUserEntry = mongoose.model("DemoUserEntry", DemoUserEntrySchema);
module.exports = DemoUserEntry;
