const onboardingJobServices = require("../services/onboardingJob.services");
const { createResult } = require("../utils/utills");

const onboardingJobController = {};

// CREATE
onboardingJobController.create = async (req, res) => {
  try {
    const result = await onboardingJobServices.create(req.body);
    return res.status(200).json(createResult("Job created successfully", result));
  } catch (error) {
    return res.status(500).json(createResult(null, null, error.message));
  }
};

// GET BY ID
onboardingJobController.getById = async (req, res) => {
  try {
    const result = await onboardingJobServices.getById(req.params.id);
    return res.status(200).json(createResult("Job fetched successfully", result));
  } catch (error) {
    return res.status(500).json(createResult(null, null, error.message));
  }
};

// UPDATE
onboardingJobController.update = async (req, res) => {
  try {
    const result = await onboardingJobServices.update(req.params.id, req.body);
    return res.status(200).json(createResult("Job updated successfully", result));
  } catch (error) {
    return res.status(500).json(createResult(null, null, error.message));
  }
};

// DELETE
onboardingJobController.delete = async (req, res) => {
  try {
    const { jobId, userId } = req.body;

    const result = await onboardingJobServices.delete(jobId, userId);

    return res
      .status(200)
      .json(createResult("Job deleted successfully", result));
  } catch (error) {
    return res
      .status(500)
      .json(createResult(null, null, error.message));
  }
};


// GET ALL
onboardingJobController.getAll = async (req, res) => {
  try {
    const result = await onboardingJobServices.getAll();
    return res.status(200).json(createResult("Jobs fetched successfully", result));
  } catch (error) {
    return res.status(500).json(createResult(null, null, error.message));
  }
};

// SEARCH
onboardingJobController.search = async (req, res) => {
  try {
    const result = await onboardingJobServices.search(req.query.search || "");
    return res.status(200).json(createResult("Jobs search result", result));
  } catch (error) {
    return res.status(500).json(createResult(null, null, error.message));
  }
};

// JOBS CREATED BY USER
onboardingJobController.getByUser = async (req, res) => {
  try {
    const result = await onboardingJobServices.getByUser(req.params.userId);
    return res.status(200).json(createResult("User jobs fetched", result));
  } catch (error) {
    return res.status(500).json(createResult(null, null, error.message));
  }
};

// FIRM JOB LIST
onboardingJobController.getByFirm = async (req, res) => {
  try {
    const result = await onboardingJobServices.getByFirm(req.params.firmId);
    return res.status(200).json(createResult("Firm jobs fetched", result));
  } catch (error) {
    return res.status(500).json(createResult(null, null, error.message));
  }
};

// DEPARTMENT JOB LIST
onboardingJobController.getByDepartment = async (req, res) => {
  try {
    const result = await onboardingJobServices.getByDepartment(req.params.departmentId);
    return res.status(200).json(createResult("Department jobs fetched", result));
  } catch (error) {
    return res.status(500).json(createResult(null, null, error.message));
  }
};

module.exports = onboardingJobController;
