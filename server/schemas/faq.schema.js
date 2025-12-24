const mongoose = require("mongoose");

const mediaSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["image", "video", "none"],
    default: "none",
  },
  url: {
    type: String,
    trim: true,
    default: "",
    validate: {
      validator: function (v) {
        return (
          v === "" ||
          v.startsWith("blob:") ||
          /^(https?:\/\/)[\w.-]+(\.[\w\.-]+)+[/#?]?.*$/.test(v)
        );
      },
      message: (props) => `${props.value} is not a valid URL!`,
    },
  },
});

const faqSchema = new mongoose.Schema(
  {
    question: { type: String, required: true },
    slug: { type: String, unique: true },
    answer: { type: String, required: true },

    // ✅ Multiple categories
    category: {
      type: [String],
      enum: [
        "Overview",
        "Account",
        "Roles",
        "Features",
        "Clients",
        "Reports",
        "Security",
        "Billing",
        "Integrations",
        "Invoices",
        "Inventory Management",
        "Support",
        "Policies",
      ],
      default: ["Overview"],
      validate: {
        validator: function (arr) {
          return Array.isArray(arr) && arr.every((v) => typeof v === "string");
        },
        message: "Category must be an array of strings",
      },
    },

    media: { type: [mediaSchema], default: [] },

    priority: {
      type: Number,
      default: 1,
      min: 1,
      validate: {
        validator: Number.isInteger,
        message: "{VALUE} is not an integer value",
      },
    },

    Url: {
      type: String,
      trim: true,
      default: "",
      validate: {
        validator: function (v) {
          return (
            v === "" ||
            /^(https?:\/\/)[\w.-]+(\.[\w\.-]+)+[/#?]?.*$/.test(v)
          );
        },
        message: (props) => `${props.value} is not a valid reference URL!`,
      },
    },

    navigateTo: { type: String, default: "" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    deletedAt: { type: Date, default: null },

    views: { type: Number, default: 0 },
    viewedIPs: { type: [String], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("FAQ", faqSchema);
