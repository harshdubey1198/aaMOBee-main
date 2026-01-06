const express = require("express");
const router = express.Router();

const firmPolicyController = require("../controllers/firmPolicy.controller");
const { tokenVerification } = require("../middleware/auth.middleware");
const { checkPermission } = require("../middleware/permission.middleware");

// CREATE POLICY
router.post(
  "/create",
  tokenVerification,
  checkPermission("hr.policies.manage"),
  firmPolicyController.create
);

// GET POLICY BY FIRM
router.get(
  "/by-firm/:firmId",
  tokenVerification,
  checkPermission("hr.policies.manage"),
  firmPolicyController.getByFirm
);

// UPDATE POLICY
router.put(
  "/update/:policyId",
  tokenVerification,
  checkPermission("hr.policies.manage"),
  firmPolicyController.update
);

// DELETE POLICY
router.delete(
  "/delete/:policyId",
  tokenVerification,
  checkPermission("hr.policies.manage"),
  firmPolicyController.remove
);

module.exports = router;
