const express = require("express");
const router = express.Router();

const { tokenVerification } = require("../middleware/auth.middleware");
const designationController = require("../controllers/designation.controllers");
// ✅ CREATE
router.post("/create", designationController.create);

// ✅ GET INACTIVE DESIGNATIONS (MUST BE BEFORE :id)
router.get("/inactive", designationController.getInactive);

// ✅ GET ALL DESIGNATIONS BY DEPARTMENT
router.get("/by-department/:departmentId", designationController.getByDepartment);

// ✅ REACTIVATE DESIGNATION
router.put("/reactivate/:id", designationController.reactivate);

// ✅ UPDATE DESIGNATION
router.put("/:id", designationController.update);

// ✅ SOFT DELETE
router.delete("/:id", designationController.delete);

// ✅ GET SINGLE DESIGNATION (THIS MUST BE LAST)
router.get("/:id", designationController.getById);

router.post("/search", designationController.search);



module.exports = router;
