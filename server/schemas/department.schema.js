const mongoose = require("mongoose");

const departmentSchema = new mongoose.Schema({

  firmId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",   // role = firm / firm_admin
    required: true
  },

  name: {
    type: String,
    required: true,
    trim: true
  },

  code: {
    type: String,
    uppercase: true
  },

  parentDepartmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department",
    default: null
  },

  departmentHead: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null
  },

  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active"
  }

}, { timestamps: true });

module.exports = mongoose.model("Department", departmentSchema);
