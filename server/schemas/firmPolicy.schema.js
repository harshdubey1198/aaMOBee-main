// firmPolicy.schema.js
const mongoose = require("mongoose");

const firmPolicySchema = new mongoose.Schema({
  firmId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Firm",
    required: true
  },

  basicPercent: { type: Number, required: true },   // e.g. 40
  hraPercent: { type: Number, required: true },     // e.g. 20

  allowances: [{
    name: String,           // Travel, Medical
    percent: Number         // % of CTC
  }],

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
}, { timestamps: true });

module.exports = mongoose.model("FirmPolicy", firmPolicySchema);
