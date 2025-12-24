const express = require("express");
const router = express.Router();

const { tokenVerification } = require("../middleware/auth.middleware");
const hrmsController = require("../controllers/hrms.controller");

// Assign department & designation to user
router.post(
  "/assign-employee",
  // tokenVerification,
  hrmsController.assignDepartmentAndDesignation
);

// Set department head
router.post(
  "/set-department-head",
  // tokenVerification,
  hrmsController.setDepartmentHead
);

module.exports = router;
