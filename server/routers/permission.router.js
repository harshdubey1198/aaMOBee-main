const express = require("express");
const router = express.Router();

const permissionController = require("../controllers/permission.contoller");
// ADD PERMISSION TO USER
router.post("/add", permissionController.add);

// REMOVE PERMISSION FROM USER
router.post("/remove", permissionController.remove);
router.get("/getAll", permissionController.getAll);
router.get("/user/:userId", permissionController.getByUser);
router.get("/by-permission/:permission",permissionController.getUsersByPermission);
router.post("/firm-users",permissionController.getFirmUsersByPermission);

module.exports = router;