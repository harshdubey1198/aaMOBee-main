const express = require("express");
const router = express.Router();

const permissionController = require("../controllers/permission.contoller");

router.get("/getAll", permissionController.getAll);
router.get("/user/:userId", permissionController.getByUser);
router.get("/by-permission/:permission",permissionController.getUsersByPermission);

module.exports = router;