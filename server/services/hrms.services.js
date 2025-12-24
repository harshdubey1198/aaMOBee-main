const User = require("../schemas/user.schema");
const Department = require("../schemas/department.schema");
const Designation = require("../schemas/designation.schema");

const hrmsServices = {};

// ✅ Assign department & designation to user
hrmsServices.assignDepartmentAndDesignation = async (data) => {

  const {
    userId,
    firmId,           
    departmentId,
    designationId,
    assignedBy
  } = data;

  if (!userId || !firmId || !assignedBy) {
    throw new Error("userId, firmId and assignedBy are required");
  }

  // Validate user exist
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  // Validate firm/admin exist
  const firmAdmin = await User.findById(firmId);
  if (!firmAdmin) throw new Error("Firm/Admin not found");

  // Validate assigner role
  if (
    !["client_admin", "firm_admin"].includes(firmAdmin.role)
  ) {
    throw new Error("Only client_admin or firm_admin can assign departments");
  }

  // If department provided, validate
  if (departmentId) {
    const department = await Department.findById(departmentId);
    if (!department) throw new Error("Invalid Department");
  }

  // If designation provided, validate
  if (designationId) {
    const designation = await Designation.findById(designationId);
    if (!designation) throw new Error("Invalid Designation");
  }

  // Check Duplicate
  const alreadyAssigned = user.firmAccess.some(
    fa =>
      fa.adminId.toString() === firmId &&
      fa.departmentId?.toString() === departmentId &&
      fa.designationId?.toString() === designationId &&
      fa.isActive === true
  );

  if (alreadyAssigned) {
    throw new Error("User is already assigned to this firm/department/designation");
  }

  // Push to firmAccess
  user.firmAccess.push({
    adminId: firmId,
    departmentId: departmentId || null,
    designationId: designationId || null,
    assignedBy,
    isActive: true
  });

  await user.save();

  return user;
};

// ✅ Set Department Head (Only client_admin or firm_admin)
hrmsServices.setDepartmentHead = async (data) => {

  const {
    departmentId,
    userId,
    assignedBy
  } = data;

  if (!departmentId || !userId || !assignedBy) {
    throw new Error("departmentId, userId and assignedBy are required");
  }

  const assigner = await User.findById(assignedBy);

  if (!["client_admin", "firm_admin"].includes(assigner.role)) {
    throw new Error("Only client_admin or firm_admin can set department head");
  }

  const department = await Department.findById(departmentId);

  if (!department) throw new Error("Department not found");

  // Assign head
  department.departmentHead = userId;
  await department.save();

  return department;
};

module.exports = hrmsServices;
