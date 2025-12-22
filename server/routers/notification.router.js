const express = require("express");
const { getUserNotifications, markNotificationAsRead ,sendDuePaymentNotification} = require("../controllers/notification.controller");

const router = express.Router();

router.get("/:userId", getUserNotifications);

router.put("/read/:notificationId", markNotificationAsRead);
// router.post("/due-payments/test", sendDuePaymentNotification);


module.exports = router;
