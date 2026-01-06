// employeeVerification.schema.js
const mongoose = require("mongoose");

const employeeVerificationSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    required: true
  },

  credentials: {
    emailVerified: { type: Boolean, default: false },
    mobileVerified: { type: Boolean, default: false }
  },

  documents: [{
    type: {
      type: String, // aadhaar, pan, offer_letter
      required: true
    },
    fileUrl: String,
    verified: { type: Boolean, default: false }
  }],

  faceVerification: {
    liveImage: String,
    storedImage: String,
    matched: { type: Boolean, default: false }
  },

  virtualVerification: {
    imageUrl: String,
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    verifiedAt: Date
  },

  approval: {
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending"
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    approvedAt: Date
  },

  loginEnabled: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model("EmployeeVerification", employeeVerificationSchema);
