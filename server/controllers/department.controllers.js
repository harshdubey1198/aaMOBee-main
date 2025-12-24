const departmentServices = require("../services/department.services");
const { createResult } = require("../utils/utills");

const departmentController = {};

// CREATE
departmentController.create = async (req, res) => {
    try {
        const result = await departmentServices.createDepartment(req.body);
        return res.status(200).json(createResult("Department created successfully", result));
    } catch (error) {
        return res.status(500).json(createResult(null, null, error.message));
    }
};

// GET BY FIRM
departmentController.getByFirm = async (req, res) => {
    try {
        const page = req.query.page || 1;
        const result = await departmentServices.getDepartmentsByFirm(req.params.firmId, page);

        return res.status(200).json(createResult(
            "Departments fetched successfully",
            result
        ));
    } catch (error) {
        return res.status(500).json(createResult(null, null, error.message));
    }
};

// GET BY ID
departmentController.getById = async (req, res) => {
    try {
        const result = await departmentServices.getDepartmentById(req.params.id);
        return res.status(200).json(createResult("Department found", result));
    } catch (error) {
        return res.status(500).json(createResult(null, null, error.message));
    }
};

// UPDATE
departmentController.update = async (req, res) => {
    try {
        const result = await departmentServices.updateDepartment(req.params.id, req.body);
        return res.status(200).json(createResult("Department updated successfully", result));
    } catch (error) {
        return res.status(500).json(createResult(null, null, error.message));
    }
};

// DELETE
departmentController.delete = async (req, res) => {
    try {
        const result = await departmentServices.deleteDepartment(req.params.id);
        return res.status(200).json(createResult("Department deleted successfully", result));
    } catch (error) {
        return res.status(500).json(createResult(null, null, error.message));
    }
};

// GET BY PARENT
departmentController.getByParent = async (req, res) => {
    try {
        const page = req.query.page || 1;

        const result = await departmentServices.getByParent(
            req.params.parentDepartmentId,
            page
        );

        return res.status(200).json(
            createResult("Sub-departments fetched successfully", result)
        );
    } catch (error) {
        return res.status(500).json(
            createResult(null, null, error.message)
        );
    }
};


// REACTIVATE
departmentController.reactivate = async (req, res) => {
    try {
        const result = await departmentServices.reactivateDepartment(req.params.id);
        return res.status(200).json(createResult("Department reactivated successfully", result));
    } catch (error) {
        return res.status(500).json(createResult(null, null, error.message));
    }
};
// GET INACTIVE DEPARTMENTS WITH CHILDREN
departmentController.getInactiveWithChildren = async (req, res) => {
    try {
        const page = req.query.page || 1;

        const result = await departmentServices.getInactiveWithChildren(
            req.params.firmId,
            page
        );

        return res.status(200).json(
            createResult("Inactive departments fetched successfully", result)
        );
    } catch (error) {
        return res.status(500).json(
            createResult(null, null, error.message)
        );
    }
};
// GET DEPARTMENT WITH DESIGNATIONS
departmentController.getDepartmentWithDesignations = async (req, res) => {
    try {
        const result = await departmentServices.getDepartmentWithDesignations(
            req.params.departmentId
        );

        return res.status(200).json(
            createResult(
                "Department with designations fetched successfully",
                result
            )
        );

    } catch (error) {
        return res.status(500).json(
            createResult(null, null, error.message)
        );
    }
};


module.exports = departmentController;
