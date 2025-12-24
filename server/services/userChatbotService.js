const UserChatbotData = require('../schemas/userChatbotData');

// ✅ ONE function to save user + chats
const saveUserWithChats = async (name, mobileNumber, email, chats) => {
  try {
    let user = await UserChatbotData.findOne({ mobileNumber });

    // If user exists → update chats
    if (user) {
      if (chats && chats.length > 0) {
        user.chats.push(...chats);
      }
      await user.save();
      return user;
    }

    // If new user → create
    user = new UserChatbotData({
      name,
      mobileNumber,
      email,
      chats
    });

    await user.save();
    return user;

  } catch (error) {
    throw new Error('Error saving user & chat: ' + error.message);
  }
};

module.exports = {
  saveUserWithChats
};
