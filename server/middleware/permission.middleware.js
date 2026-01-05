const User = require("../schemas/user.schema");

const checkPermission = (requiredPermission) => {
  return async (req, res, next) => {
    try {
      const userId = req.user?.id; // comes from tokenVerification

      if (!userId) {
        return res.status(401).json({
          message: "Unauthorized"
        });
      }

      const user = await User.findById(userId)
        .select("permissionsHolding role");

      if (!user) {
        return res.status(401).json({
          message: "User not found"
        });
      }

      // ✅ SUPER ADMIN & CLIENT ADMIN → FULL ACCESS
      if (
        user.role === "super_admin" ||
        user.role === "client_admin"
      ) {
        return next();
      }

      // safety check
      if (!user.permissionsHolding || !Array.isArray(user.permissionsHolding)) {
        return res.status(403).json({
          message: "No permissions assigned"
        });
      }

      // exact permission OR manage permission
      const managePermission = requiredPermission.replace(
        /\.(create|view|update|delete)$/,
        ".manage"
      );

      const hasPermission =
        user.permissionsHolding.includes(requiredPermission) ||
        user.permissionsHolding.includes(managePermission);

      if (!hasPermission) {
        return res.status(403).json({
          message: "You do not have permission to perform this action"
        });
      }

      next();
    } catch (error) {
      return res.status(500).json({
        message: error.message
      });
    }
  };
};

module.exports = { checkPermission };
