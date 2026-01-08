const express = require("express");
const router = express.Router();

const employeeVerificationController =
  require("../controllers/employeeVerification.controller");

const { tokenVerification } = require("../middleware/auth.middleware");
const { checkPermission } = require("../middleware/permission.middleware");

// CREATE VERIFICATION RECORD
router.post(
  "/create",
  tokenVerification,
  checkPermission("hr.documents.manage"),
  employeeVerificationController.create
);

// GET VERIFICATION DETAILS
router.get(
  "/:employeeId",
  tokenVerification,
  checkPermission("hr.documents.manage"),
  employeeVerificationController.getByEmployee
);

// UPLOAD / UPDATE DOCUMENTS
router.post(
  "/documents",
  tokenVerification,
  checkPermission("hr.documents.manage"),
  employeeVerificationController.updateDocuments
);

// APPROVE EMPLOYEE (LOGIN ENABLE)
router.post(
  "/approve",
  tokenVerification,
  checkPermission("hr.onboarding.manage"),
  employeeVerificationController.approve
);

// REJECT EMPLOYEE
router.post(
  "/reject",
  tokenVerification,
  checkPermission("hr.onboarding.manage"),
  employeeVerificationController.reject
);

module.exports = router;
