const employeeVerificationServices = require("../services/employeeVerification.services");
const utills = require("../utils/utills");

const employeeVerificationController = {};

// CREATE INITIAL RECORD
employeeVerificationController.create = async (req, res) => {
  try {
    const result = await employeeVerificationServices.create(
      req.body.employeeId
    );

    return res.status(200).send(
      utills.createResult("Employee verification record created", result)
    );
  } catch (error) {
    return res.status(500).send(
      utills.createResult(null, null, error.message)
    );
  }
};

// GET BY EMPLOYEE
employeeVerificationController.getByEmployee = async (req, res) => {
  try {
    const result = await employeeVerificationServices.getByEmployee(
      req.params.employeeId
    );

    return res.status(200).send(
      utills.createResult("Employee verification fetched", result)
    );
  } catch (error) {
    return res.status(500).send(
      utills.createResult(null, null, error.message)
    );
  }
};

// UPDATE DOCUMENTS
employeeVerificationController.updateDocuments = async (req, res) => {
  try {
    const result = await employeeVerificationServices.updateDocuments(
      req.body.employeeId,
      req.body.documents
    );

    return res.status(200).send(
      utills.createResult("Employee documents updated", result)
    );
  } catch (error) {
    return res.status(500).send(
      utills.createResult(null, null, error.message)
    );
  }
};

// APPROVE
employeeVerificationController.approve = async (req, res) => {
  try {
    const result = await employeeVerificationServices.approve(
      req.body.employeeId,
      req.user.id
    );

    return res.status(200).send(
      utills.createResult("Employee approved successfully", result)
    );
  } catch (error) {
    return res.status(500).send(
      utills.createResult(null, null, error.message)
    );
  }
};

// REJECT
employeeVerificationController.reject = async (req, res) => {
  try {
    const result = await employeeVerificationServices.reject(
      req.body.employeeId,
      req.user.id
    );

    return res.status(200).send(
      utills.createResult("Employee rejected successfully", result)
    );
  } catch (error) {
    return res.status(500).send(
      utills.createResult(null, null, error.message)
    );
  }
};

module.exports = employeeVerificationController;
