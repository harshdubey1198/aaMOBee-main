// routes/onboardingJob.routes.js
const express = require("express");
const router = express.Router();

const onboardingJobController = require("../controllers/onboardingJob.controllers");

// CREATE
router.post("/create", onboardingJobController.create);

// GET ALL
router.get("/alljobs", onboardingJobController.getAll);

// SEARCH ?search=
router.get("/search", onboardingJobController.search);

// GET BY ID
router.get("/:id", onboardingJobController.getById);

// UPDATE
router.put("/:id", onboardingJobController.update);

// DELETE
router.post("/delete", onboardingJobController.delete);

// JOBS CREATED BY USER
router.get("/by-user/:userId", onboardingJobController.getByUser);

// FIRM JOB LIST
router.get("/by-firm/:firmId", onboardingJobController.getByFirm);

// DEPARTMENT JOB LIST
router.get("/by-department/:departmentId", onboardingJobController.getByDepartment);

module.exports = router;
