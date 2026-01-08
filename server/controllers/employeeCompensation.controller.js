const employeeCompensationServices = require("../services/employeeCompensation.services");
const utills = require("../utils/utills");

const employeeCompensationController = {};

// CREATE / GENERATE
employeeCompensationController.create = async (req, res) => {
  try {
    const result = await employeeCompensationServices.create(req.body);

    return res.status(200).send(
      utills.createResult("Employee compensation generated successfully", result)
    );
  } catch (error) {
    return res.status(500).send(
      utills.createResult(null, null, error.message)
    );
  }
};

// GET BY EMPLOYEE
employeeCompensationController.getByEmployee = async (req, res) => {
  try {
    const result = await employeeCompensationServices.getByEmployee(
      req.params.employeeId
    );

    return res.status(200).send(
      utills.createResult("Employee compensation fetched successfully", result)
    );
  } catch (error) {
    return res.status(500).send(
      utills.createResult(null, null, error.message)
    );
  }
};

// UPDATE
employeeCompensationController.update = async (req, res) => {
  try {
    const result = await employeeCompensationServices.update(
      req.params.compensationId,
      req.body
    );

    return res.status(200).send(
      utills.createResult("Employee compensation updated successfully", result)
    );
  } catch (error) {
    return res.status(500).send(
      utills.createResult(null, null, error.message)
    );
  }
};

// DELETE
employeeCompensationController.remove = async (req, res) => {
  try {
    await employeeCompensationServices.remove(req.params.compensationId);

    return res.status(200).send(
      utills.createResult("Employee compensation deleted successfully")
    );
  } catch (error) {
    return res.status(500).send(
      utills.createResult(null, null, error.message)
    );
  }
};

module.exports = employeeCompensationController;
