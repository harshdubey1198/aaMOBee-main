const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: {
    type: String,
    enum: ['user', 'bot'],
    required: true
  },
  text: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const userChatbotDataSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },

  mobileNumber: {
    type: String,
    required: true,
    match: [/^\d{10}$/, 'Enter valid 10-digit number'],
  },

  email: {
    type: String,
    required: true,
    lowercase: true
  },

  chats: [messageSchema],   // ✅ FULL CONVERSATION

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('UserChatbotData', userChatbotDataSchema);
