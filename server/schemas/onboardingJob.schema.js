const mongoose = require("mongoose");

const onboardingJobSchema = new mongoose.Schema(
  {
    jobTitle: {
      type: String,
      required: true,
      trim: true,
    },

    jobSlug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    criteria: { type: String, default: "" },

    experience: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["active", "inactive", "hold", "completed"],
      default: "active",
    },

    departmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true,
    },
    
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    firmId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    followUpSteps: [
      {
        stepName: { type: String, required: true },
        status: {
          type: String,
          enum: ["pending", "in-progress", "cleared", "rejected"],
          default: "pending",
        },
        remarks: { type: String, default: "" },
        updatedAt: { type: Date, default: Date.now },
      },
    ],

    shortlistedCandidates: [
      {
        candidateId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Candidate",
        },
        currentStepIndex: { type: Number, default: 0 },
      },
    ],
      deletedAt: {
        type: Date,
        default: null
      },

    documents: [
      {
        label: { type: String },
        url: { type: String },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("OnboardingJob", onboardingJobSchema);
