// const mongoose = require('mongoose');

// const planSchema = new mongoose.Schema({
//     title: {
//         type: String,
//         required: true,
//     },
//     caption: {
//         type: String,
//         required: true,
//     },
//     icon: {
//         type: String,
//         required: true,
//     },
//     price: {
//         type: Number,
//         required: true,
//     },
//     // maxUsers: { type: Number },
//     maxFirms: { type: Number },
//     features: [{ type: String }],
//     days: {  
//         type: Number,
//         required: true,  
//     },
//     deleted_at: { 
//         type: Date, 
//         default: null 
//     }
// }, { timestamps: true });

// const Plan = mongoose.model('Plan', planSchema);
// module.exports = Plan;


const mongoose = require("mongoose");

// Offer details schema
const offerSchema = new mongoose.Schema({
  durationType: {
    type: String,
    enum: ["monthly", "yearly", "custom"],
    required: true,
  },
  durationValue: { type: Number, default: 1 }, // no. of months/years
  days: { type: Number, required: true },      // validity in days

  originalPrice: { type: Number, required: true },
  discountedPrice: { type: Number },
  discountPercent: { type: Number },
  taglineText: { type: String, default: "" }, 
});

// Price per country schema
const priceSchema = new mongoose.Schema({
  country: { type: String, required: true },  // "IN", "US", "AE"
  currency: { type: String, required: true }, // "INR", "USD", "AED"
  basePrice: { type: Number, required: true },// base monthly price
  offers: [offerSchema],
});

const planSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    caption: { type: String, required: true },
    icon: { type: String, default: "fas fa-shield-alt" },

    prices: [priceSchema],   // pricing per country with offers

    maxFirms: { type: Number, default: 1 },
    features: [{ type: String }],
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    deleted_at: { type: Date, default: null },
  },
  { timestamps: true }
);

const Plan = mongoose.model("Plan", planSchema);
module.exports = Plan;
