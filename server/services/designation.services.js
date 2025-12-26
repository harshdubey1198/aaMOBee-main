const Designation = require("../schemas/designation.schema");
const { getPagination } = require("../utils/pagination");

const designationServices = {};

// CREATE
designationServices.createDesignation = async (body) => {
    const { firmId, departmentId, title } = body;

    if (!firmId || !departmentId || !title) {
        throw new Error("firmId, departmentId and title are required");
    }

    const existing = await Designation.findOne({
        firmId,
        departmentId,
        title
    });

    if (existing) {
        throw new Error("Designation already exists for this department");
    }

    const designation = await Designation.create(body);
    return designation;
};

// GET ALL BY DEPARTMENT

designationServices.getByDepartment = async (departmentId, page = 1) => {
    if (!departmentId) throw new Error("departmentId is required");

    const { limit, skip } = getPagination(page);

    const query = {
        departmentId,
        status: "active"
    };

    // ✅ SAME QUERY for count & data (important)
    const totalCount = await Designation.countDocuments(query);
    const totalPages = Math.ceil(totalCount / limit);

    const designations = await Designation.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    const baseUrl =
        process.env.BASE_URL +
        `/api/designation/by-department/${departmentId}`;

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
designationServices.updateDesignation = async (id, data) => {
    const updated = await Designation.findByIdAndUpdate(id, data, { new: true });

    if (!updated) {
        throw new Error("Update failed. Designation not found");
    }

    return updated;
};

// SOFT DELETE
designationServices.deleteDesignation = async (id) => {
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
designationServices.reactivateDesignation = async (id) => {
    if (!id) throw new Error("designationId is required");

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
designationServices.getInactiveDesignations = async (filters, page = 1) => {

    console.log("\n----------- DEBUG DESIGNATION INACTIVE -----------");
    console.log("📩 Incoming Filters:", filters);
    console.log("📄 Page:", page);

    const { limit, skip } = getPagination(page);

    console.log("🔢 Limit:", limit);
    console.log("⏭ Skip:", skip);

    const query = { status: "inactive" };

    if (filters.firmId) {
        query.firmId = filters.firmId;
    }

    if (filters.departmentId) {
        query.departmentId = filters.departmentId;
    }

    console.log("🔍 Query Being Used:", query);

    // CHECK ALL INACTIVE FIRST
    const allInactive = await Designation.find({ status: "inactive" });
    console.log("📦 TOTAL INACTIVE IN DB:", allInactive.length);

    allInactive.forEach(d => {
        console.log({
            id: d._id,
            title: d.title,
            firmId: d.firmId,
            departmentId: d.departmentId,
            status: d.status
        });
    });

    // TOTAL COUNT
    const totalCount = await Designation.countDocuments(query);
    console.log("✅ MATCHED COUNT:", totalCount);

    const totalPages = Math.ceil(totalCount / limit);

    // FETCH DATA
    const designations = await Designation.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    console.log("📥 RESULT LENGTH:", designations.length);

    designations.forEach(d => {
        console.log({
            id: d._id,
            title: d.title,
            firmId: d.firmId,
            departmentId: d.departmentId,
            status: d.status
        });
    });

    const baseUrl = process.env.BASE_URL + `/api/designation/inactive`;

    const urlParams = new URLSearchParams(filters).toString();

    console.log("URL PARAMS:", urlParams);
    console.log("----------- DEBUG END -----------\n");

    return {
        totalCount,
        totalPages,
        currentPage: Number(page),

        nextPage:
            page < totalPages
                ? `${baseUrl}?${urlParams}&page=${Number(page) + 1}`
                : null,

        previousPage:
            page > 1
                ? `${baseUrl}?${urlParams}&page=${Number(page) - 1}`
                : null,

        data: designations
    };
};

designationServices.searchDesignations = async ({
    firmId,
    departmentId,
    search,
    page = 1,
    limit = 10
}) => {

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
