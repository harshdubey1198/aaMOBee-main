// employee.schema.js
const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  firmId: { type: mongoose.Schema.Types.ObjectId, ref: "Firm" },

  departmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department",
    required: true
  },

  designationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Designation",
    required: true
  },

  onboardingJobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "OnboardingJob",
    required: true
  },

  joiningDate: { type: Date, required: true },
  endDate: { type: Date },

  status: {
    type: String,
    enum: ["active", "resigned", "terminated"],
    default: "active"
  }
}, { timestamps: true });

module.exports = mongoose.model("Employee", employeeSchema);
