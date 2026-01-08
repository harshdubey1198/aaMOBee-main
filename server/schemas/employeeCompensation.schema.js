// employeeCompensation.schema.js
const mongoose = require("mongoose");

const employeeCompensationSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    required: true
  },

  firmId: { type: mongoose.Schema.Types.ObjectId, ref: "Firm" },

  offerCTC: { type: Number, required: true },

  salaryBreakdown: [{
    month: String, // YYYY-MM
    basic: Number,
    hra: Number,
    allowances: [{
      name: String,
      amount: Number
    }],
    total: Number
  }]
}, { timestamps: true });

module.exports = mongoose.model("EmployeeCompensation", employeeCompensationSchema);
