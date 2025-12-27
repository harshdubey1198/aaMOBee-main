// services/onboardingJob.services.js
const OnboardingJob = require("../schemas/onboardingJob.schema");
const User = require("../schemas/user.schema");

const onboardingJobServices = {};

// 🔐 common permission checker
const hasPermission = (user, required) => {
  if (!user || !user.permissionsHolding) return false;

  // if manage → allow everything
  if (user.permissionsHolding.includes("hr.onboarding.manage")) return true;

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
onboardingJobServices.getAll = async () => {
  return await OnboardingJob.find({}).sort({ createdAt: -1 });
};

// SEARCH
onboardingJobServices.search = async (search) => {
  return await OnboardingJob.find({
    $or: [
      { jobTitle: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
      { jobSlug: { $regex: search, $options: "i" } },
    ],
  });
};

// CREATED BY USER
onboardingJobServices.getByUser = async (userId) => {
  return await OnboardingJob.find({ createdBy: userId }).sort({ createdAt: -1 });
};

// BY FIRM
onboardingJobServices.getByFirm = async (firmId) => {
  return await OnboardingJob.find({ firmId }).sort({ createdAt: -1 });
};

// BY DEPARTMENT
onboardingJobServices.getByDepartment = async (departmentId) => {
  return await OnboardingJob.find({ departmentId }).sort({ createdAt: -1 });
};

module.exports = onboardingJobServices;
