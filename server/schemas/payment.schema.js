const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const paymentSchema = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  
    planId: { type: mongoose.Schema.Types.ObjectId, ref: 'Plan', required: true },  
    paymentDate: { type: Date, default: Date.now }, 
    amount: { type: Number, required: true }, 
    currency: { type: String},
    status: { type: String, enum: ['pending', 'completed', 'failed', 'expired'], default: 'pending' },
    expirationDate: { type: Date }, 

    // ✅ Reminder flags
  reminder7dSent: { type: Boolean, default: false },
  reminder3dSent: { type: Boolean, default: false },
  reminder24hSent: { type: Boolean, default: false },
  reminder1hSent: { type: Boolean, default: false },
}, {timestamps: true});

const Payment = mongoose.model('Payment', paymentSchema);
module.exports = Payment;
