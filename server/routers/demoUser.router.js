const express = require("express");
const router = express.Router();
const demoUserController = require("../controllers/demoUser.controller");

router.post("/create-demo-user", demoUserController.createDemoUser);
router.post("/log-demo-activity", demoUserController.logDemoActivity);

module.exports = router;
