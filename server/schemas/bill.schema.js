const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const billingSchema = new Schema({
  billNumber: { type: String, required: true },
  firmId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  customerName: { type: String, required: true },
  customerPhone: { type: String },
  customerEmail: { type: String },
  customerAddress: {
    h_no: { type: String },
    city: { type: String },
    state: { type: String },
    zip_code: { type: String },
    country: { type: String }
  },
  items: [
    {
      itemName: { type: String, required: true },
      description: { type: String },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
      tax: { type: Number, default: 0 }, // ✅ tax % or fixed amount
      total: { type: Number, required: true }
    }
  ],
  overallDiscount: {
    type: Number,
    default: 0 // In percentage or flat depending on your use case
  },
  discountType: {
    type: String,
    enum: ['flat', 'percentage'],
    default: 'flat' // or 'percentage'
  },
  billCurrency: {
    type: String,
    default: 'INR'
  },
  billDate: { type: Date, default: Date.now },
  totalAmount: { type: Number, required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  notes: { type: String },
  status: {
    type: String,
    enum: ['draft', 'final'],
    default: 'draft'
  },
  deleted_at: { type: Date, default: null },
  billLayout: { type: String, default: '' }
}, { timestamps: true });

const ManualBill = mongoose.model('ManualBill', billingSchema);

module.exports = ManualBill;
