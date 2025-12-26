const Department = require("../schemas/department.schema");
const { getPagination } = require("../utils/pagination");
const departmentServices = {};
const Designation = require("../schemas/designation.schema");

// CREATE
departmentServices.createDepartment = async (body) => {
    const { firmId, name, code } = body;

    if (!firmId || !name || !code) {
        throw new Error("firmId, name and code are required");
    }

    // normalize string: lowercase, remove spaces & symbols
    const normalize = (value) =>
        value
            .toLowerCase()
            .replace(/[^a-z0-9]/g, ""); // removes spaces & symbols

    const normalizedName = normalize(name);
    const normalizedCode = normalize(code);

    // check uniqueness using normalized values
    const existing = await Department.findOne({
        firmId,
        $or: [
            { normalizedName },
            { normalizedCode }
        ]
    });

    if (existing) {
        throw new Error(
            "Department name or code already exists for this firm"
        );
    }

    const department = await Department.create({
        ...body,
        normalizedName,
        normalizedCode,
    });

    return department;
};


// GET ALL BY FIRM
departmentServices.getDepartmentsByFirm = async (firmId, page = 1) => {
    if (!firmId) throw new Error("firmId is required");

    const { limit, skip } = getPagination(page);

    // fetch ALL departments of firm (active + inactive)
    const allDepartments = await Department.find({ firmId })
        .populate("parentDepartmentId", "_id status code name")
        .lean();

    // create map for fast lookup
    const departmentMap = new Map();
    allDepartments.forEach(dep => {
        departmentMap.set(dep._id.toString(), dep);
    });

    // recursive check → if ANY parent is inactive → hide
    const isHierarchyActive = (department) => {
        let current = department;

        while (current.parentDepartmentId) {
            const parent = departmentMap.get(
                current.parentDepartmentId._id.toString()
            );

            if (!parent || parent.status !== "active") {
                return false;
            }

            current = parent;
        }

        return department.status === "active";
    };

    // filter valid hierarchy
    const validDepartments = allDepartments.filter(isHierarchyActive);

    const totalCount = validDepartments.length;
    const totalPages = Math.ceil(totalCount / limit);

    const paginatedDepartments = validDepartments
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(skip, skip + limit);

    const formattedDepartments = paginatedDepartments.map(dep => ({
        ...dep
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

departmentServices.searchDepartments = async ({ firmId, search, page = 1, limit = 10 }) => {
    // console.log("Function called with:", { firmId, search, page, limit });

    if (!firmId) {
        // console.log("Error: firmId is missing");
        throw new Error("firmId is required");
    }

    if (!search || search.trim().length < 3) {
        // console.log("Error: search term too short or missing");
        throw new Error("Search must be at least 3 characters");
    }

    const normalize = (value) => {
        const normalized = value.toLowerCase().replace(/[^a-z0-9]/g, "");
        // console.log("Normalized keyword:", normalized);
        return normalized;
    };

    const keyword = normalize(search);

    const { skip } = getPagination(page, limit);
    // console.log("Pagination skip value:", skip);

    const matchQuery = {
        firmId,
        status: "active",
        $or: [
            { name: { $regex: keyword, $options: "i" } },
            { code: { $regex: keyword, $options: "i" } }
        ]
    };
    // console.log("Match query:", matchQuery);

    const data = await Department.find(matchQuery)
        .populate("parentDepartmentId", "name code status")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
    // console.log("Fetched data:", data);

    const totalCount = await Department.countDocuments(matchQuery);
    // console.log("Total count of matching departments:", totalCount);

    const result = {
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        currentPage: page,
        data
    };
    // console.log("Final result:", result);

    return result;
};

module.exports = departmentServices;
