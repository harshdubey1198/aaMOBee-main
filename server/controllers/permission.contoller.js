const permissionServices = require("../services/permission.services");
const { createResult } = require("../utils/utills");

const permissionController = {};

permissionController.add = async (req, res) => {
  try {
    const result = await permissionServices.addPermission(req.body);
    return res
      .status(200)
      .json(createResult("Permission added successfully", result));
  } catch (error) {
    return res
      .status(500)
      .json(createResult(null, null, error.message));
  }
};

permissionController.remove = async (req, res) => {
  try {
    const result = await permissionServices.removePermission(req.body);
    return res
      .status(200)
      .json(createResult("Permission removed successfully", result));
  } catch (error) {
    return res
      .status(500)
      .json(createResult(null, null, error.message));
  }
};
permissionController.getAll = async (req, res) => {
  try {
    const result = await permissionServices.getAll();
    return res
      .status(200)
      .json(createResult("Permissions fetched successfully", result));
  } catch (error) {
    return res
      .status(500)
      .json(createResult(null, null, error.message));
  }
};
permissionController.getByUser = async (req, res) => {
  try {
    const result = await permissionServices.getByUser(req.params.userId);

    return res
      .status(200)
      .json(createResult("User permissions fetched successfully", result));
  } catch (error) {
    return res
      .status(500)
      .json(createResult(null, null, error.message));
  }
};
permissionController.getUsersByPermission = async (req, res) => {
  try {
    const result = await permissionServices.getUsersByPermission(
      req.params.permission
    );

    return res
      .status(200)
      .json(createResult("Users fetched successfully", result));
  } catch (error) {
    return res
      .status(500)
      .json(createResult(null, null, error.message));
  }
};

permissionController.getFirmUsersByPermission = async (req, res) => {
  try {
    const result = await permissionServices.getFirmUsersByPermission(req.body);

    return res
      .status(200)
      .json(createResult("Firm users fetched successfully", result));
  } catch (error) {
    return res
      .status(500)
      .json(createResult(null, null, error.message));
  }
};


module.exports = permissionController;
