const mongoose = require("mongoose");

const designationSchema = new mongoose.Schema({

  firmId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  departmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department",
    required: true
  },

  title: {
    type: String,
    required: true
  },

  level: {
    type: String,
    enum: [ "intern", "trainee", "junior", "associate", "mid", "senior", "team_lead","lead", "assistant_manager", "manager", "senior_manager", "department_head", "director", "senior_director", "vice_president", "senior_vice_president", "executive_director", "coo", "cto", "cfo", "ceo", "head", "founder" ],
    default: "junior"
    },


  description: {
    type: String
  },

  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active"
  }

}, { timestamps: true });

module.exports = mongoose.model("Designation", designationSchema);
