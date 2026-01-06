const express = require("express");
const router = express.Router();

const employeeController = require("../controllers/employee.controller");
const { tokenVerification } = require("../middleware/auth.middleware");
const { checkPermission } = require("../middleware/permission.middleware");

// CREATE EMPLOYEE (from onboarding)
router.post(
  "/create",
  tokenVerification,
  checkPermission("hr.onboarding.manage"),
  employeeController.create
);

// GET EMPLOYEES BY FIRM
router.get(
  "/by-firm/:firmId",
  tokenVerification,
  checkPermission("hr.onboarding.manage"),
  employeeController.getByFirm
);

// GET SINGLE EMPLOYEE
router.get(
  "/:employeeId",
  tokenVerification,
  checkPermission("hr.onboarding.manage"),
  employeeController.getById
);

// UPDATE EMPLOYEE
router.put(
  "/update/:employeeId",
  tokenVerification,
  checkPermission("hr.onboarding.manage"),
  employeeController.update
);

// TERMINATE EMPLOYEE (soft delete)
router.delete(
  "/delete/:employeeId",
  tokenVerification,
  checkPermission("hr.onboarding.manage"),
  employeeController.remove
);

module.exports = router;
