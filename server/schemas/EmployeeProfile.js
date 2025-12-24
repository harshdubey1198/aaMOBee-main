// models/EmployeeProfile.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const employeeProfileSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },

  employeeCode: { type: String, unique: true },
  designation: { type: String },
  department: { type: String },
  joiningDate: { type: Date },
  reportingManager: { type: Schema.Types.ObjectId, ref: "User" },

  workLocation: { type: String },
  employmentType: { type: String, enum: ["full-time", "part-time", "contract"] },
  
  // Optional HRMS-specific details
  salaryStructure: {
    basic: { type: Number },
    hra: { type: Number },
    allowances: { type: Number },
    deductions: { type: Number }
  },

}, { timestamps: true });

module.exports = mongoose.model("EmployeeProfile", employeeProfileSchema);
