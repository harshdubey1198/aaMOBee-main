const DemoUserService = require("../services/demoUser.services");
const { createResult } = require("../utils/utills");

const demoUserController = {};

demoUserController.createDemoUser = async (req, res) => {
  try {
    const user = await DemoUserService.createDemoUser(req.body);
    return res
      .status(200)
      .json(createResult("Demo user created and mail sent successfully", user));
  } catch (err) {
    return res.status(400).json(createResult(null, null, err.message));
  }
};

demoUserController.logDemoActivity = async (req, res) => {
  try {
    const { userId, route, action } = req.body;
    await DemoUserService.logDemoActivity(userId, route, action);
    return res
      .status(200)
      .json(createResult("Activity logged successfully", null));
  } catch (err) {
    return res.status(400).json(createResult(null, null, err.message));
  }
};

module.exports = demoUserController;
