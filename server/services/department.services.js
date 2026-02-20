const Department = require("../schemas/department.schema");
const Designation = require("../schemas/designation.schema");
const { getPagination } = require("../utils/pagination");

const departmentServices = {};

// CREATE
departmentServices.createDepartment = async (body) => {
  const { firmId, name, code } = body;

  if (!firmId || !name || !code) {
    throw new Error("firmId, name and code are required");
  }

  const normalize = (value) =>
    value.toLowerCase().replace(/[^a-z0-9]/g, "");

  const normalizedName = normalize(name);
  const normalizedCode = normalize(code);

  const existing = await Department.findOne({
    firmId,
    $or: [{ normalizedName }, { normalizedCode }]
  });

  if (existing) {
    throw new Error("Department name or code already exists for this firm");
  }

  return Department.create({
    ...body,
    normalizedName,
    normalizedCode
  });
};

// GET ALL BY FIRM
departmentServices.getDepartmentsByFirm = async (firmId, page = 1) => {
  if (!firmId) throw new Error("firmId is required");

  const { limit, skip } = getPagination(page);

  const allDepartments = await Department.find({ firmId })
    .populate("parentDepartmentId", "_id status code name")
    .lean();

  const departmentMap = new Map();
  allDepartments.forEach(dep =>
    departmentMap.set(dep._id.toString(), dep)
  );

  const isHierarchyActive = (department) => {
    let current = department;
    while (current.parentDepartmentId) {
      const parent = departmentMap.get(
        current.parentDepartmentId._id.toString()
      );
      if (!parent || parent.status !== "active") return false;
      current = parent;
    }
    return department.status === "active";
  };

  const validDepartments = allDepartments.filter(isHierarchyActive);

  const totalCount = validDepartments.length;
  const totalPages = Math.ceil(totalCount / limit);

  const data = validDepartments
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(skip, skip + limit);

  const baseUrl =
    process.env.BASE_URL + `/api/department/by-firm/${firmId}`;

  return {
    totalCount,
    totalPages,
    currentPage: Number(page),
    nextPage:
      page < totalPages ? `${baseUrl}?page=${page + 1}` : null,
    previousPage:
      page > 1 ? `${baseUrl}?page=${page - 1}` : null,
    data
  };
};

// GET BY ID
departmentServices.getDepartmentById = async (id) => {
  const department = await Department.findById(id);
  if (!department) throw new Error("Department not found");
  return department;
};

// UPDATE
departmentServices.updateDepartment = async (id, data) => {
  const department = await Department.findByIdAndUpdate(id, data, {
    new: true
  });

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

// REACTIVATE
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

// GET BY PARENT
departmentServices.getByParent = async (parentDepartmentId, page = 1) => {
  if (!parentDepartmentId) {
    throw new Error("parentDepartmentId is required");
  }

  const { limit, skip } = getPagination(page);

  const totalCount = await Department.countDocuments({
    parentDepartmentId,
    status: "active"
  });

  const totalPages = Math.ceil(totalCount / limit);

  const data = await Department.find({
    parentDepartmentId,
    status: "active"
  })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const baseUrl =
    process.env.BASE_URL +
    `/api/department/by-parent/${parentDepartmentId}`;

  return {
    totalCount,
    totalPages,
    currentPage: Number(page),
    nextPage:
      page < totalPages ? `${baseUrl}?page=${page + 1}` : null,
    previousPage:
      page > 1 ? `${baseUrl}?page=${page - 1}` : null,
    data
  };
};

// INACTIVE PARENTS WITH CHILDREN
departmentServices.getInactiveWithChildren = async (firmId, page = 1) => {
  if (!firmId) throw new Error("firmId is required");

  const { limit, skip } = getPagination(page);

  const parents = await Department.find({
    firmId,
    parentDepartmentId: null
  }).sort({ createdAt: -1 });

  const result = [];

  for (const parent of parents) {
    const children = await Department.find({
      parentDepartmentId: parent._id
    }).sort({ createdAt: -1 });

    if (
      parent.status === "inactive" ||
      children.some(c => c.status === "inactive")
    ) {
      result.push({ ...parent.toObject(), children });
    }
  }

  return {
    totalCount: result.length,
    totalPages: Math.ceil(result.length / limit),
    currentPage: Number(page),
    data: result.slice(skip, skip + limit)
  };
};

// DEPARTMENT WITH DESIGNATIONS
departmentServices.getDepartmentWithDesignations = async (departmentId) => {
  if (!departmentId) throw new Error("departmentId is required");

  const department = await Department.findById(departmentId);
  if (!department) throw new Error("Department not found");

  const designations = await Designation.find({
    departmentId: department._id
  }).sort({ createdAt: -1 });

  return {
    department,
    totalDesignations: designations.length,
    designations
  };
};

// SEARCH
departmentServices.searchDepartments = async ({
  firmId,
  search,
  page = 1,
  limit = 10
}) => {
  if (!firmId) throw new Error("firmId is required");
  if (!search || search.trim().length < 3) {
    throw new Error("Search must be at least 3 characters");
  }

  const keyword = search.toLowerCase().replace(/[^a-z0-9]/g, "");
  const { skip } = getPagination(page, limit);

  const query = {
    firmId,
    status: "active",
    $or: [
      { name: { $regex: keyword, $options: "i" } },
      { code: { $regex: keyword, $options: "i" } }
    ]
  };

  const data = await Department.find(query)
    .populate("parentDepartmentId", "name code status")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const totalCount = await Department.countDocuments(query);

  return {
    totalCount,
    totalPages: Math.ceil(totalCount / limit),
    currentPage: page,
    data
  };
};

module.exports = departmentServices;
