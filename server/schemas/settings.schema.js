const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
    appName: { 
        type: String, 
        required: true 
    },
    supportEmail: { 
        type: String, 
        required: true 
    },
    contactNumber: { 
        type: String, 
        required: true 
    },
    maxUsers: { 
        type: Number, 
        default: 0 
    },
    maxFirms: { 
        type: Number, 
        default: 0 
    },
    paymentGateways: {
        razorpay: {
            status: { type: Boolean, default: false }, // enable/disable
            keyId: { type: String, default: '' },
            keySecret: { type: String, default: '' }
        },
        stripe: {
            status: { type: Boolean, default: false }, // enable/disable
            publishableKey: { type: String, default: '' },
            secretKey: { type: String, default: '' }
        }
    },
    features: [{ type: String }], // list of app-wide enabled features
    deleted_at: { 
        type: Date, 
        default: null 
    }
}, { timestamps: true });

const Settings = mongoose.model('Settings', settingsSchema);

module.exports = Settings;
