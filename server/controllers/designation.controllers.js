const designationServices = require("../services/designation.services");
const { createResult } = require("../utils/utills");

const designationController = {};

// CREATE
designationController.create = async (req, res) => {
    try {
        const result = await designationServices.createDesignation(req.body);
        return res.status(200).json(createResult("Designation created successfully", result));
    } catch (error) {
        return res.status(500).json(createResult(null, null, error.message));
    }
};

// GET BY DEPARTMENT
designationController.getByDepartment = async (req, res) => {
    try {
        const result = await designationServices.getByDepartment(req.params.departmentId);
        return res.status(200).json(createResult("Designations fetched successfully", result));
    } catch (error) {
        return res.status(500).json(createResult(null, null, error.message));
    }
};

// GET BY ID
designationController.getById = async (req, res) => {
    try {
        const result = await designationServices.getById(req.params.id);
        return res.status(200).json(createResult("Designation found", result));
    } catch (error) {
        return res.status(500).json(createResult(null, null, error.message));
    }
};

// UPDATE
designationController.update = async (req, res) => {
    try {
        const result = await designationServices.updateDesignation(req.params.id, req.body);
        return res.status(200).json(createResult("Designation updated successfully", result));
    } catch (error) {
        return res.status(500).json(createResult(null, null, error.message));
    }
};

// DELETE
designationController.delete = async (req, res) => {
    try {
        const result = await designationServices.deleteDesignation(req.params.id);
        return res.status(200).json(createResult("Designation deleted successfully", result));
    } catch (error) {
        return res.status(500).json(createResult(null, null, error.message));
    }
};
// REACTIVATE DESIGNATION
designationController.reactivate = async (req, res) => {
    try {
        const result = await designationServices.reactivateDesignation(
            req.params.id
        );

        return res
            .status(200)
            .json(createResult("Designation reactivated successfully", result));

    } catch (error) {
        return res
            .status(500)
            .json(createResult(null, null, error.message));
    }
};

// GET ALL INACTIVE DESIGNATIONS (with Pagination)
designationController.getInactive = async (req, res) => {
    try {
        const { firmId, departmentId } = req.query;
        const page = req.query.page || 1;

        const result = await designationServices.getInactiveDesignations(
            { firmId, departmentId },
            page
        );

        return res.status(200).json(
            createResult("Inactive designations fetched successfully", result)
        );

    } catch (error) {
        return res.status(500).json(
            createResult(null, null, error.message)
        );
    }
};

module.exports = designationController;
