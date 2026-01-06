const Employee = require("../schemas/employee.schema");

const employeeServices = {};

// CREATE (from onboarding job)
employeeServices.create = async (body) => {
  const {
    userId,
    firmId,
    departmentId,
    designationId,
    onboardingJobId,
    joiningDate
  } = body;

  if (!firmId || !departmentId || !designationId || !onboardingJobId) {
    throw new Error("Missing required fields");
  }

  return Employee.create({
    userId,
    firmId,
    departmentId,
    designationId,
    onboardingJobId,
    joiningDate
  });
};

// READ (by firm)
employeeServices.getByFirm = async (firmId) => {
  return Employee.find({ firmId })
    .populate("departmentId")
    .populate("designationId")
    .populate("onboardingJobId");
};

// READ (single)
employeeServices.getById = async (employeeId) => {
  return Employee.findById(employeeId)
    .populate("departmentId designationId onboardingJobId");
};

// UPDATE
employeeServices.update = async (employeeId, body) => {
  return Employee.findByIdAndUpdate(
    employeeId,
    body,
    { new: true }
  );
};

// DELETE (soft delete)
employeeServices.remove = async (employeeId) => {
  return Employee.findByIdAndUpdate(
    employeeId,
    { status: "terminated" },
    { new: true }
  );
};

module.exports = employeeServices;
