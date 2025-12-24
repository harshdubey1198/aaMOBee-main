const express = require("express");
const router = express.Router();

const { tokenVerification } = require("../middleware/auth.middleware");
const departmentController = require("../controllers/department.controllers");

// CREATE DEPARTMENT
router.post("/create", 
    // tokenVerification,
     departmentController.create);

// GET ALL DEPARTMENTS BY FIRM
router.get("/by-firm/:firmId", 
    // tokenVerification,
     departmentController.getByFirm);

// GET SINGLE DEPARTMENT BY ID
router.get("/:id", 
    // tokenVerification,
     departmentController.getById);

// UPDATE DEPARTMENT
router.put("/:id", 
    // tokenVerification,
     departmentController.update);

// SOFT DELETE DEPARTMENT
router.delete("/:id", 
    // tokenVerification,
     departmentController.delete);

// GET SUB DEPARTMENTS BY PARENT ID
router.get("/by-parent/:parentDepartmentId", departmentController.getByParent);

// REACTIVATE DEPARTMENT
router.put("/reactivate/:id", departmentController.reactivate);
// GET INACTIVE DEPARTMENTS WITH CHILDREN
router.get("/inactive/by-firm/:firmId", departmentController.getInactiveWithChildren);

// GET DEPARTMENT WITH DESIGNATIONS
router.get(
    "/with-designations/:departmentId",
    // tokenVerification,
    departmentController.getDepartmentWithDesignations
);

module.exports = router;
