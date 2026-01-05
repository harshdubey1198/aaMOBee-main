const Designation = require("../schemas/designation.schema");
const { getPagination } = require("../utils/pagination");
const { HRMS_PERMISSIONS } = require("../utils/permissions");

const designationServices = {};

const hasPermission = (user, required) => {
  if (!user) return false;

  // super_admin & client_admin → full access
  if (user.role === "super_admin" || user.role === "client_admin") {
    return true;
  }

  if (!user.permissionsHolding) return false;

  // manage permission → allow all
  if (user.permissionsHolding.includes("hr.designation.manage")) {
    return true;
  }

  return user.permissionsHolding.includes(required);
};

// CREATE
designationServices.createDesignation = async (body, user) => {
    if (!hasPermission(user, HRMS_PERMISSIONS.DESIGNATION_CREATE)) {
        throw new Error("You do not have permission to create designation");
    }

    const { firmId, departmentId, title } = body;

    if (!firmId || !departmentId || !title) {
        throw new Error("firmId, departmentId and title are required");
    }

    const existing = await Designation.findOne({ firmId, departmentId, title });

    if (existing) {
        throw new Error("Designation already exists for this department");
    }

    return await Designation.create(body);
};


// GET ALL BY DEPARTMENT

designationServices.getByDepartment = async (departmentId, page = 1, user) => {
    

    if (!departmentId) throw new Error("departmentId is required");

    const { limit, skip } = getPagination(page);

    const query = { departmentId, status: "active" };

    const totalCount = await Designation.countDocuments(query);
    const totalPages = Math.ceil(totalCount / limit);

    const designations = await Designation.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    const baseUrl =
        process.env.BASE_URL + `/api/designation/by-department/${departmentId}`;

    return {
        totalCount,
        totalPages,
        currentPage: Number(page),
        nextPage: page < totalPages ? `${baseUrl}?page=${page + 1}` : null,
        previousPage: page > 1 ? `${baseUrl}?page=${page - 1}` : null,
        data: designations
    };
};



// GET BY ID
designationServices.getById = async (id) => {
    const designation = await Designation.findById(id);

    if (!designation) {
        throw new Error("Designation not found");
    }

    return designation;
};

// UPDATE
designationServices.updateDesignation = async (id, data, user) => {
    if (!hasPermission(user, HRMS_PERMISSIONS.DESIGNATION_EDIT)) {
        throw new Error("You do not have permission to update designation");
    }

    const updated = await Designation.findByIdAndUpdate(id, data, { new: true });

    if (!updated) {
        throw new Error("Update failed. Designation not found");
    }

    return updated;
};


// SOFT DELETE
designationServices.deleteDesignation = async (id, user) => {
    if (!hasPermission(user, HRMS_PERMISSIONS.DESIGNATION_DELETE)) {
        throw new Error("You do not have permission to delete designation");
    }

    const updated = await Designation.findByIdAndUpdate(
        id,
        { status: "inactive" },
        { new: true }
    );

    if (!updated) {
        throw new Error("Delete failed. Designation not found");
    }

    return updated;
};

// REACTIVATE DESIGNATION
designationServices.reactivateDesignation = async (id, user) => {
    if (!hasPermission(user, HRMS_PERMISSIONS.DESIGNATION_DELETE)) {
        throw new Error("You do not have permission to reactivate designation");
    }

    const updated = await Designation.findByIdAndUpdate(
        id,
        { status: "active" },
        { new: true }
    );

    if (!updated) {
        throw new Error("Designation not found");
    }

    return updated;
};

designationServices.getInactiveDesignations = async (filters, page = 1, user) => {
    if (!hasPermission(user, HRMS_PERMISSIONS.DESIGNATION_VIEW)) {
        throw new Error("You do not have permission to view inactive designations");
    }

    const { limit, skip } = getPagination(page);
    const query = { status: "inactive", ...filters };

    const totalCount = await Designation.countDocuments(query);
    const totalPages = Math.ceil(totalCount / limit);

    const designations = await Designation.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    const baseUrl = process.env.BASE_URL + `/api/designation/inactive`;

    const params = new URLSearchParams(filters).toString();

    return {
        totalCount,
        totalPages,
        currentPage: Number(page),
        nextPage: page < totalPages ? `${baseUrl}?${params}&page=${page + 1}` : null,
        previousPage: page > 1 ? `${baseUrl}?${params}&page=${page - 1}` : null,
        data: designations
    };
};


designationServices.searchDesignations = async ({
    firmId,
    departmentId,
    search,
    page = 1,
    limit = 10
}, user) => {

    if (!hasPermission(user, HRMS_PERMISSIONS.DESIGNATION_VIEW)) {
        throw new Error("You do not have permission to search designations");
    }

    if (!firmId || !departmentId) {
        throw new Error("firmId and departmentId are required");
    }

    if (!search || search.trim().length < 3) {
        throw new Error("Search must be at least 3 characters");
    }

    const normalize = (value) =>
        value.toLowerCase().replace(/[^a-z0-9]/g, "");

    const keyword = normalize(search);
    const { skip } = getPagination(page, limit);

    const matchQuery = {
        firmId,
        departmentId,
        status: "active",
        title: { $regex: keyword, $options: "i" }
    };

    const data = await Designation.find(matchQuery)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    const totalCount = await Designation.countDocuments(matchQuery);

    return {
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        currentPage: page,
        data
    };
};





module.exports = designationServices;
