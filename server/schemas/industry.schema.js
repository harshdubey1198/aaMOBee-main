const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const IndustrySchema = new Schema({
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
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' }, 
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  deleted_at: { type: Date, default: null }
}, { timestamps: true });

const IndustryService = mongoose.model('IndustryService', IndustrySchema);

module.exports = IndustryService;
