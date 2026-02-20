const User = require("../schemas/user.schema");

const checkPermission = (requiredPermission) => {
  return async (req, res, next) => {
    try {
      const userId = req.user?.id || req.user?._id;

      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const user = await User.findById(userId)
        .select("role permissionsHolding");

      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      // ✅ SUPER ADMIN / CLIENT ADMIN → FULL ACCESS
      if (user.role === "super_admin" || user.role === "client_admin") {
        return next();
      }

      // ❌ normal users must have permissions
      if (!Array.isArray(user.permissionsHolding)) {
        return res.status(403).json({
          message: "No permissions assigned"
        });
      }

      // manage permission auto-allows create/update/delete/view
      const managePermission = requiredPermission.replace(
        /\.(create|view|update|delete)$/,
        ".manage"
      );

      const allowed =
        user.permissionsHolding.includes(requiredPermission) ||
        user.permissionsHolding.includes(managePermission);

      if (!allowed) {
        return res.status(403).json({
          message: "You do not have permission to perform this action"
        });
      }

      next();
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };
};

module.exports = { checkPermission };
