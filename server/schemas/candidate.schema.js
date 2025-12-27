const mongoose = require("mongoose");

const candidateSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },

    lastName: {
      type: String,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    mobile: {
      type: String,
    },

    alternateMobile: {
      type: String,
    },

    onboardingJobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "OnboardingJob",
      required: true,
    },

    departmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true,
    },

    resumeUrl: {
      type: String,
    },

    tags: [
      {
        type: String,
        trim: true,
      },
    ],

    status: {
      type: String,
      enum: [
        "applied",
        "shortlisted",
        "interview_scheduled",
        "in_progress",
        "offer_released",
        "joined",
        "rejected",
        "on_hold",
      ],
      default: "applied",
    },

    followUps: [
      {
        stepName: {
          type: String,
          required: true,
        },
        status: {
          type: String,
          enum: ["pending", "cleared", "rejected", "rescheduled"],
          default: "pending",
        },
        scheduledAt: {
          type: Date,
        },
        remarks: {
          type: String,
          default: "",
        },
        updatedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        updatedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    expectedCtc: {
      type: Number,
      default: 0,
    },

    offeredCtc: {
      type: Number,
      default: 0,
    },

    experience: {
      type: String,
      default: "",
    },

    currentCompany: {
      type: String,
      default: "",
    },

    noticePeriod: {
      type: String,
      default: "",
    },

    documents: [
      {
        label: { type: String },
        url: { type: String },
      },
    ],

    // 🔗 SOCIAL / PUBLIC PROFILES (REFERENCE LINKS)
    referenceLinks: [
      {
        label: {
          type: String,
          enum: [
            "linkedin",
            "github",
            "canva",
            "youtube",
            "instagram",
            "twitter",
            "x",
            "portfolio",
            "other",
          ],
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
      },
    ],

    linkedUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Candidate", candidateSchema);
