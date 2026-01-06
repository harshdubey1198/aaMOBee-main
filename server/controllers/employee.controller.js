const employeeServices = require("../services/employee.services");
const utills = require("../utils/utills");

const employeeController = {};

// CREATE
employeeController.create = async (req, res) => {
  try {
    const result = await employeeServices.create(req.body);
    return res.status(200).send(
      utills.createResult("Employee created successfully", result)
    );
  } catch (error) {
    return res.status(500).send(
      utills.createResult(null, null, error.message)
    );
  }
};

// GET BY FIRM
employeeController.getByFirm = async (req, res) => {
  try {
    const result = await employeeServices.getByFirm(req.params.firmId);
    return res.status(200).send(
      utills.createResult("Employees fetched successfully", result)
    );
  } catch (error) {
    return res.status(500).send(
      utills.createResult(null, null, error.message)
    );
  }
};

// GET BY ID
employeeController.getById = async (req, res) => {
  try {
    const result = await employeeServices.getById(req.params.employeeId);
    return res.status(200).send(
      utills.createResult("Employee fetched successfully", result)
    );
  } catch (error) {
    return res.status(500).send(
      utills.createResult(null, null, error.message)
    );
  }
};

// UPDATE
employeeController.update = async (req, res) => {
  try {
    const result = await employeeServices.update(
      req.params.employeeId,
      req.body
    );

    return res.status(200).send(
      utills.createResult("Employee updated successfully", result)
    );
  } catch (error) {
    return res.status(500).send(
      utills.createResult(null, null, error.message)
    );
  }
};

// DELETE (SOFT)
employeeController.remove = async (req, res) => {
  try {
    const result = await employeeServices.remove(req.params.employeeId);

    return res.status(200).send(
      utills.createResult("Employee terminated successfully", result)
    );
  } catch (error) {
    return res.status(500).send(
      utills.createResult(null, null, error.message)
    );
  }
};

module.exports = employeeController;
