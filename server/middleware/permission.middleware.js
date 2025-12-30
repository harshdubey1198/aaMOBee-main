const User = require("../schemas/user.schema");

const checkPermission = (requiredPermission) => {
  return async (req, res, next) => {
    try {
      const userId = req.user?.id; // tokenVerification se aata hai

      if (!userId) {
        return res.status(401).json({
          message: "Unauthorized"
        });
      }

      const user = await User.findById(userId).select("permissionsHolding role");

      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      // super admin → full access
      if (user.role === "super_admin") {
        return next();
      }

      // exact permission OR manage permission
      const hasPermission =
        user.permissionsHolding.includes(requiredPermission) ||
        user.permissionsHolding.includes(
          requiredPermission.replace(
            /\.(create|view|update|delete)$/,
            ".manage"
          )
        );

      if (!hasPermission) {
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
