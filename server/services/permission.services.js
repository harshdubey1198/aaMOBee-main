const { HRMS_PERMISSIONS } = require("../utils/permissions");
const User = require("../schemas/user.schema")
const permissionServices = {};
permissionServices.addPermission = async (body) => {
  const { userId, permission } = body;

  if (!userId || !permission) throw new Error("userId and permission are required");

  if (!HRMS_PERMISSIONS.includes(permission)) {
    throw new Error("Invalid HRMS permission");
  }

  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  if (!user.permissionsHolding.includes(permission)) {
    user.permissionsHolding.push(permission);
    await user.save();
  }

  return user;
};

permissionServices.removePermission = async (body) => {
  const { userId, permission } = body;

  if (!userId || !permission) throw new Error("userId and permission are required");

  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  user.permissionsHolding = user.permissionsHolding.filter((p) => p !== permission);
  await user.save();

  return user;
};
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
permissionServices.getFirmUsersByPermission = async ({ firmId, permission }) => {
  if (!firmId) throw new Error("firmId is required");

  const query = {
    adminId: firmId,
    permissionsHolding: { $exists: true, $ne: [] }   // ⭐ must have at least one permission
  };

  if (permission) {
    query.permissionsHolding = permission;
  }

  const users = await User.find(
    query,
    { firstName: 1, lastName: 1, email: 1, permissionsHolding: 1, role: 1 }
  );

  return users;
};


module.exports = permissionServices;