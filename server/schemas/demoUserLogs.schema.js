const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DemoUserLogsSchema = new Schema(
  {
    demoUserId: { type: Schema.Types.ObjectId, ref: "User", required: true },

    // Action logs: clicks, form submits, input changes
    actionLogs: [
      {
        type: { type: String, enum: ["click", "form_submit", "input_change"], required: true },
        tag: { type: String },
        id: { type: String },
        className: { type: String },
        name: { type: String },
        value: { type: String },
        formId: { type: String },
        data: { type: Object },
        route: { type: String },
        timestamp: { type: Date, default: Date.now },
      },
    ],

    // Route time logs: route name and time spent
    routeLogs: [
      {
        route: { type: String, required: true },
        timeSpent: { type: String, required: true }, // format "hh_mm_ss"
        timestamp: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

const DemoUserLogs = mongoose.model("DemoUserLogs", DemoUserLogsSchema);
module.exports = DemoUserLogs;
