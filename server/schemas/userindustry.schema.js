const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserIndustrySchema = new Schema({
  firmId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  industry: {
    type: String,
    required: true,
    // enum: ['manufacturing', 'trading', 'service']
  },
  sub_industry: {
    type: String,
    required: true
  },
  services: [
    {
      label: { type: String, required: true },
      value: { type: String, required: true }
    }
  ],
  is_verified: { type: Boolean, default: false }, // ✅ Added this line
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  deleted_at: { type: Date, default: null }
}, { timestamps: true });

const UserIndustryService = mongoose.model('UserIndustryService', UserIndustrySchema);

module.exports = UserIndustryService;
