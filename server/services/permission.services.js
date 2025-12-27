const { HRMS_PERMISSIONS } = require("../utils/permissions");
const { getPagination } = require("../utils/pagination");
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

permissionServices.getUsersByPermission = async (
  permission,
  page = 1,
  limit = 10
) => {
  if (!permission) throw new Error("permission is required");

  const { skip } = getPagination(page, limit);

  const query = { permissionsHolding: permission };

  const totalCount = await User.countDocuments(query);
  const totalPages = Math.ceil(totalCount / limit);

  const users = await User.find(
    query,
    { firstName: 1, lastName: 1, email: 1, permissionsHolding: 1 }
  )
    .skip(skip)
    .limit(limit);

  const baseUrl =
    process.env.BASE_URL +
    `/api/permission/by-permission/${permission}`;

  return {
    totalCount,
    totalPages,
    currentPage: Number(page),

    nextPage:
      page < totalPages ? `${baseUrl}?page=${Number(page) + 1}&limit=${limit}` : null,

    previousPage:
      page > 1 ? `${baseUrl}?page=${Number(page) - 1}&limit=${limit}` : null,

    data: users
  };
};


permissionServices.getFirmUsersByPermission = async ({
  firmId,
  permission,
  page = 1,
  limit = 10
}) => {
  if (!firmId) throw new Error("firmId is required");

  const { skip } = getPagination(page, limit);

  const query = {
    adminId: firmId,
    permissionsHolding: { $exists: true, $ne: [] }
  };

  if (permission) {
    query.permissionsHolding = permission;
  }

  const totalCount = await User.countDocuments(query);
  const totalPages = Math.ceil(totalCount / limit);

  const users = await User.find(
    query,
    { firstName: 1, lastName: 1, email: 1, permissionsHolding: 1, role: 1 }
  )
    .skip(skip)
    .limit(limit);

  const baseUrl =
    process.env.BASE_URL + `/api/permission/firm-users`;

  return {
    totalCount,
    totalPages,
    currentPage: Number(page),

    nextPage:
      page < totalPages
        ? `${baseUrl}?page=${Number(page) + 1}&limit=${limit}`
        : null,

    previousPage:
      page > 1
        ? `${baseUrl}?page=${Number(page) - 1}&limit=${limit}`
        : null,

    data: users
  };
};




module.exports = permissionServices;