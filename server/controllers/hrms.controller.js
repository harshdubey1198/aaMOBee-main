const hrmsServices = require("../services/hrms.services");
const { createResult } = require("../utils/utills");

const hrmsController = {};

// Assign department & designation
hrmsController.assignDepartmentAndDesignation = async (req, res) => {
  try {
    const result = await hrmsServices.assignDepartmentAndDesignation(req.body);

    return res
      .status(200)
      .json(createResult("User assigned successfully", result));

  } catch (error) {
    return res
      .status(500)
      .json(createResult(null, null, error.message));
  }
};


// Set Department Head
hrmsController.setDepartmentHead = async (req, res) => {
  try {
    const result = await hrmsServices.setDepartmentHead(req.body);

    return res
      .status(200)
      .json(createResult("Department head set successfully", result));

  } catch (error) {
    return res
      .status(500)
      .json(createResult(null, null, error.message));
  }
};

module.exports = hrmsController;
