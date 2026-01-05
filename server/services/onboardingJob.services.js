// services/onboardingJob.services.js
const OnboardingJob = require("../schemas/onboardingJob.schema");
const User = require("../schemas/user.schema");
const { getPagination } = require("../utils/pagination");
const onboardingJobServices = {};

// 🔐 common permission checker
const hasPermission = (user, required) => {
  if (!user) return false;

  // super_admin & client_admin → full access
  if (user.role === "super_admin" || user.role === "client_admin") {
    return true;
  }

  if (!user.permissionsHolding) return false;

  // manage permission → allow all
  if (user.permissionsHolding.includes("hr.onboarding.manage")) {
    return true;
  }

  return user.permissionsHolding.includes(required);
};


// CREATE
onboardingJobServices.create = async (body) => {
  const { jobTitle, jobSlug, departmentId, firmId, createdBy } = body;

  if (!jobTitle || !jobSlug || !departmentId || !firmId || !createdBy) {
    throw new Error("jobTitle, jobSlug, departmentId, firmId, createdBy are required");
  }

  const user = await User.findById(createdBy);
  if (!user) throw new Error("User not found");

  if (!hasPermission(user, "hr.recruitment.create")) {
    throw new Error("You don't have permission to create jobs");
  }

  const exists = await OnboardingJob.findOne({ jobSlug });
  if (exists) throw new Error("Job slug already exists");

  return await OnboardingJob.create(body);
};

// GET BY ID
onboardingJobServices.getById = async (id) => {
  const job = await OnboardingJob.findById(id);
  if (!job) throw new Error("Job not found");
  return job;
};

// UPDATE
onboardingJobServices.update = async (id, body) => {
  const { userId } = body;
  if (!userId) throw new Error("userId is required for permission check");

  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  if (!hasPermission(user, "hr.recruitment.update")) {
    throw new Error("You don't have permission to update jobs");
  }

  const job = await OnboardingJob.findByIdAndUpdate(id, body, { new: true });
  if (!job) throw new Error("Job not found");

  return job;
};


// DELETE
onboardingJobServices.delete = async (id, userId) => {


  try {
    const cleanUserId = String(userId).trim();
    const user = await User.findById(cleanUserId);
    if (!user) {      throw new Error("User not found");
    }

    // permission check
    if (!hasPermission(user, "hr.recruitment.delete")) {      
      throw new Error("You don't have permission to delete jobs");
    }

    const job = await OnboardingJob.findById(id);    
    if (!job) {      
      throw new Error("Job not found");
    }

    job.deletedAt = new Date();
    await job.save();

    return job;
  } catch (err) {
        throw err;
  }
};

// GET ALL
onboardingJobServices.getAll = async (page = 1) => {
  const { limit, skip } = getPagination(page);

  const totalCount = await OnboardingJob.countDocuments({ deletedAt: null });

  const data = await OnboardingJob.find({ deletedAt: null })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const totalPages = Math.ceil(totalCount / limit);

  const baseUrl = process.env.BASE_URL + "/api/onboarding-job/alljobs";

  return {
    totalCount,
    totalPages,
    currentPage: Number(page),
    nextPage: page < totalPages ? `${baseUrl}?page=${Number(page) + 1}` : null,
    previousPage: page > 1 ? `${baseUrl}?page=${Number(page) - 1}` : null,
    data
  };
};


// SEARCH
onboardingJobServices.search = async ({ search, page = 1, limit = 10 }) => {
  if (!search || search.trim().length < 3) {
    throw new Error("Search must be at least 3 characters");
  }

  const { skip } = getPagination(page, limit);

  const matchQuery = {
    deletedAt: null,
    $or: [
      { jobTitle: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
      { jobSlug: { $regex: search, $options: "i" } }
    ]
  };

  const data = await OnboardingJob.find(matchQuery)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const totalCount = await OnboardingJob.countDocuments(matchQuery);

  return {
    totalCount,
    totalPages: Math.ceil(totalCount / limit),
    currentPage: Number(page),
    data
  };
};


// CREATED BY USER
onboardingJobServices.getByUser = async (userId, page = 1) => {
  const { limit, skip } = getPagination(page);

  const totalCount = await OnboardingJob.countDocuments({
    createdBy: userId,
    deletedAt: null
  });

  const data = await OnboardingJob.find({
    createdBy: userId,
    deletedAt: null
  })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const totalPages = Math.ceil(totalCount / limit);

  const baseUrl =
    process.env.BASE_URL + `/api/onboarding-job/by-user/${userId}`;

  return {
    totalCount,
    totalPages,
    currentPage: Number(page),
    nextPage: page < totalPages ? `${baseUrl}?page=${Number(page) + 1}` : null,
    previousPage: page > 1 ? `${baseUrl}?page=${Number(page) - 1}` : null,
    data
  };
};


// BY FIRM
onboardingJobServices.getByFirm = async (firmId, page = 1) => {
  const { limit, skip } = getPagination(page);

  const totalCount = await OnboardingJob.countDocuments({
    firmId,
    deletedAt: null
  });

  const data = await OnboardingJob.find({
    firmId,
    deletedAt: null
  })
     .populate("departmentId", "name") 
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const totalPages = Math.ceil(totalCount / limit);

  const baseUrl =
    process.env.BASE_URL + `/api/onboarding-job/by-firm/${firmId}`;

  return {
    totalCount,
    totalPages,
    currentPage: Number(page),
    nextPage: page < totalPages ? `${baseUrl}?page=${Number(page) + 1}` : null,
    previousPage: page > 1 ? `${baseUrl}?page=${Number(page) - 1}` : null,
    data
  };
};


// BY DEPARTMENT
onboardingJobServices.getByDepartment = async (departmentId, page = 1) => {
  const { limit, skip } = getPagination(page);

  const totalCount = await OnboardingJob.countDocuments({
    departmentId,
    deletedAt: null
  });

  const data = await OnboardingJob.find({
    departmentId,
    deletedAt: null
  })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const totalPages = Math.ceil(totalCount / limit);

  const baseUrl =
    process.env.BASE_URL + `/api/onboarding-job/by-department/${departmentId}`;

  return {
    totalCount,
    totalPages,
    currentPage: Number(page),
    nextPage: page < totalPages ? `${baseUrl}?page=${Number(page) + 1}` : null,
    previousPage: page > 1 ? `${baseUrl}?page=${Number(page) - 1}` : null,
    data
  };
};


module.exports = onboardingJobServices;
