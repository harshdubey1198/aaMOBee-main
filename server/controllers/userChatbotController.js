const userChatbotService = require('../services/userChatbotService');

// ✅ ONE API
const submitUserWithChat = async (req, res) => {
  try {
    const { name, mobileNumber, email, chats } = req.body;

    if (!name || !mobileNumber || !email) {
      return res.status(400).json({
        message: 'Name, Mobile Number, and Email are required'
      });
    }

    const result = await userChatbotService.saveUserWithChats(
      name,
      mobileNumber,
      email,
      chats || []
    );

    res.status(201).json({
      message: 'User + chat saved successfully!',
      data: result
    });

  } catch (error) {
    console.error('Error in submitUserWithChat:', error);
    res.status(500).json({
      message: 'Internal Server Error',
      error: error.message
    });
  }
};

module.exports = {
  submitUserWithChat
};
