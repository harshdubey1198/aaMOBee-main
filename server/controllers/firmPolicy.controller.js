const firmPolicyServices = require("../services/firmPolicy.services");
const utills = require("../utils/utills");

const firmPolicyController = {};

// CREATE
firmPolicyController.create = async (req, res) => {
  try {
    const result = await firmPolicyServices.create(req.body, req.user);
    return res.status(200).send(
      utills.createResult("Firm policy created successfully", result)
    );
  } catch (error) {
    return res.status(500).send(
      utills.createResult(null, null, error.message)
    );
  }
};

// GET BY FIRM
firmPolicyController.getByFirm = async (req, res) => {
  try {
    const result = await firmPolicyServices.getByFirm(req.params.firmId);
    return res.status(200).send(
      utills.createResult("Firm policy fetched successfully", result)
    );
  } catch (error) {
    return res.status(500).send(
      utills.createResult(null, null, error.message)
    );
  }
};

// UPDATE
firmPolicyController.update = async (req, res) => {
  try {
    const result = await firmPolicyServices.update(
      req.params.policyId,
      req.body
    );

    return res.status(200).send(
      utills.createResult("Firm policy updated successfully", result)
    );
  } catch (error) {
    return res.status(500).send(
      utills.createResult(null, null, error.message)
    );
  }
};

// DELETE
firmPolicyController.remove = async (req, res) => {
  try {
    await firmPolicyServices.remove(req.params.policyId);

    return res.status(200).send(
      utills.createResult("Firm policy deleted successfully")
    );
  } catch (error) {
    return res.status(500).send(
      utills.createResult(null, null, error.message)
    );
  }
};

// CHANGE STATUS (ACTIVE / INACTIVE)
firmPolicyController.changeStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const result = await firmPolicyServices.changeStatus(
      req.params.policyId,
      status
    );

    return res.status(200).send(
      utills.createResult("Firm policy status updated successfully", result)
    );
  } catch (error) {
    return res.status(500).send(
      utills.createResult(null, null, error.message)
    );
  }
};


module.exports = firmPolicyController;
