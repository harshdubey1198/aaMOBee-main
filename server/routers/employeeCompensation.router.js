const express = require("express");
const router = express.Router();

const employeeCompensationController =
  require("../controllers/employeeCompensation.controller");

const { tokenVerification } = require("../middleware/auth.middleware");
const { checkPermission } = require("../middleware/permission.middleware");

// GENERATE / CREATE SALARY
router.post(
  "/create",
  tokenVerification,
  checkPermission("hr.payroll.process"),
  employeeCompensationController.create
);

// VIEW SALARY
router.get(
  "/by-employee/:employeeId",
  tokenVerification,
  checkPermission("hr.payroll.view"),
  employeeCompensationController.getByEmployee
);

// UPDATE SALARY
router.put(
  "/update/:compensationId",
  tokenVerification,
  checkPermission("hr.payroll.process"),
  employeeCompensationController.update
);

// DELETE SALARY
router.delete(
  "/delete/:compensationId",
  tokenVerification,
  checkPermission("hr.payroll.process"),
  employeeCompensationController.remove
);

module.exports = router;
