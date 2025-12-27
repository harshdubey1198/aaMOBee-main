const { HRMS_PERMISSIONS } = require("../utils/permissions");
const User = require("../schemas/user.schema")
const permissionServices = {};

permissionServices.getAll = async () => {
  return HRMS_PERMISSIONS;
};
permissionServices.getByUser = async (userId) => {
  if (!userId) throw new Error("userId is required");

  const user = await User.findById(userId).select("permissionsHolding");

  if (!user) throw new Error("User not found");

  return user.permissionsHolding || [];
};

permissionServices.getUsersByPermission = async (permission) => {
  if (!permission) throw new Error("permission is required");

  const users = await User.find(
    { permissionsHolding: permission },
    { firstName: 1, lastName: 1, email: 1, permissionsHolding: 1 }
  );

  return users;
};

module.exports = permissionServices;