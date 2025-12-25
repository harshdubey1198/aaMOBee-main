const Department = require("../schemas/department.schema");
const { getPagination } = require("../utils/pagination");
const departmentServices = {};
const Designation = require("../schemas/designation.schema");

// CREATE
departmentServices.createDepartment = async (body) => {
    const { firmId, name } = body;

    if (!firmId || !name) {
        throw new Error("firmId and name are required");
    }

    const existing = await Department.findOne({ firmId, name });

    if (existing) {
        throw new Error("Department already exists for this firm");
    }

    const department = await Department.create(body);
    return department;
};

// GET ALL BY FIRM
departmentServices.getDepartmentsByFirm = async (firmId, page = 1) => {
    if (!firmId) throw new Error("firmId is required");

    const { limit, skip } = getPagination(page);

    const totalCount = await Department.countDocuments({
        firmId,
        status: "active",
    });

    const totalPages = Math.ceil(totalCount / limit);

    // const activeParents = await Department.find({
    //     firmId,
    //     status: "active",
    //     parentDepartmentId: null,
    // }).select("_id");

    // const activeParentIds = activeParents.map((p) => p._id.toString());

    const departments = await Department.find({
        firmId,
        status: "active",
    })
        .populate("parentDepartmentId", "name code")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    if (!departments.length) {
        return {
        totalCount,
        totalPages,
        currentPage: Number(page),
        nextPage: null,
        previousPage: null,
        data: [],
        };
    }

    // const filteredDepartments = departments.filter((dep) => {
    //     if (!dep.parentDepartmentId) return true;
    //     return activeParentIds.includes(dep.parentDepartmentId._id.toString());
    // });

   const formattedDepartments = departments.map((dep) => ({
    ...dep.toObject(),
    parentDepartmentName: dep.parentDepartmentId
        ? dep.parentDepartmentId.name
        : null,
}));


    const baseUrl =
        process.env.BASE_URL + `/api/department/by-firm/${firmId}`;

    return {
        totalCount,
        totalPages,
        currentPage: Number(page),
        nextPage:
        page < totalPages ? `${baseUrl}?page=${Number(page) + 1}` : null,
        previousPage:
        page > 1 ? `${baseUrl}?page=${Number(page) - 1}` : null,
        data: formattedDepartments,
    };
    };


// GET BY ID
departmentServices.getDepartmentById = async (id) => {
    const department = await Department.findById(id);

    if (!department) {
        throw new Error("Department not found");
    }

    return department;
};

// UPDATE
departmentServices.updateDepartment = async (id, data) => {
    const department = await Department.findByIdAndUpdate(id, data, { new: true });

    if (!department) {
        throw new Error("Update failed. Department not found");
    }

    return department;
};

// SOFT DELETE
departmentServices.deleteDepartment = async (id) => {
    const department = await Department.findByIdAndUpdate(
        id,
        { status: "inactive" },
        { new: true }
    );

    if (!department) {
        throw new Error("Delete failed. Department not found");
    }

    return department;
};

// GET BY PARENT DEPARTMENT
departmentServices.getByParent = async (parentDepartmentId, page = 1) => {
    if (!parentDepartmentId) {
        throw new Error("parentDepartmentId is required");
    }

    const { limit, skip } = getPagination(page);

    // Total active children count
    const totalCount = await Department.countDocuments({
        parentDepartmentId,
        status: "active"
    });

    const totalPages = Math.ceil(totalCount / limit);

    const departments = await Department.find({
        parentDepartmentId,
        status: "active"
    })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    const baseUrl = process.env.BASE_URL + `/api/department/by-parent/${parentDepartmentId}`;

    return {
        totalCount,
        totalPages,
        currentPage: Number(page),

        nextPage:
            page < totalPages ? `${baseUrl}?page=${Number(page) + 1}` : null,

        previousPage:
            page > 1 ? `${baseUrl}?page=${Number(page) - 1}` : null,

        data: departments
    };
};

// REACTIVATE DEPARTMENT
departmentServices.reactivateDepartment = async (id) => {
    const department = await Department.findByIdAndUpdate(
        id,
        { status: "active" },
        { new: true }
    );

    if (!department) {
        throw new Error("Department not found");
    }

    return department;
};
// GET INACTIVE PARENTS WITH ALL CHILDREN (ACTIVE + INACTIVE)
departmentServices.getInactiveWithChildren = async (firmId, page = 1) => {

    if (!firmId) throw new Error("firmId is required");

    const { limit, skip } = getPagination(page);

    // Step 1: Get all parent departments of this firm
    const allParents = await Department.find({
        firmId,
        parentDepartmentId: null
    }).sort({ createdAt: -1 });

    if (!allParents.length) {
        return {
            totalCount: 0,
            totalPages: 0,
            currentPage: Number(page),
            nextPage: null,
            previousPage: null,
            data: []
        };
    }

    const finalResult = [];

    for (const parent of allParents) {

        // Get ALL children (active + inactive)
        const children = await Department.find({
            parentDepartmentId: parent._id
        }).sort({ createdAt: -1 });

        const parentInactive = parent.status === "inactive";

        const anyChildInactive = children.some(
            child => child.status === "inactive"
        );

        // SHOW only if parent OR ANY child is inactive
        if (parentInactive || anyChildInactive) {
            finalResult.push({
                ...parent.toObject(),
                children
            });
        }
    }

    const totalCount = finalResult.length;
    const totalPages = Math.ceil(totalCount / limit);

    const paginatedData = finalResult.slice(skip, skip + limit);

    const baseUrl =
        process.env.BASE_URL + `/api/department/inactive-with-children/${firmId}`;

    return {
        totalCount,
        totalPages,
        currentPage: Number(page),

        nextPage:
            page < totalPages
                ? `${baseUrl}?page=${Number(page) + 1}`
                : null,

        previousPage:
            page > 1
                ? `${baseUrl}?page=${Number(page) - 1}`
                : null,

        data: paginatedData
    };
};

departmentServices.getDepartmentWithDesignations = async (departmentId) => {
    if (!departmentId) throw new Error("departmentId is required");

    // Get department
    const department = await Department.findById(departmentId);

    if (!department) {
        throw new Error("Department not found");
    }

    const designations = await Designation.find({
        departmentId: department._id
    }).sort({ createdAt: -1 });

    return {
        department,
        totalDesignations: designations.length,
        designations
    };
};
module.exports = departmentServices;
