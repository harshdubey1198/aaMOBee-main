const { Server } = require("socket.io");
const {
  handleUserJoin,
  handleNewNotification,
  handleDuePaymentNotification,
  handleNotificationUpdate,
  handleNotificationDelete,
  handleCriticalItemNotification,
  createDemoLog,
} = require("../services/socket.services");

const Notification = require("../schemas/notification.schema");
const Item = require("../schemas/inventoryItem.schema");
const User = require("../schemas/user.schema");
const { sendDemoExpiryEmail } = require("../utils/mailer");

let io;

const initializeSocket = (server) => {
  io = new Server(server, {
    cors: { origin: "*" },
  });

  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on("joinRoom", async (userId) => {
      handleUserJoin(socket, userId);
    });

    socket.on("demoUserAction", async (data) => {
      // console.log("📥 Received demoUserAction:", data);

      const { demoUserId, actionLog = [], routeLog = [] } = data;

      // ✅ Save / merge into DB
      const savedLog = await createDemoLog({
        demoUserId,
        actionLogs: actionLog,
        routeLogs: routeLog,
      });

      // ✅ Emit saved log back to client
      io.emit("demoLogUpdated", savedLog);
    });


    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });

  let lastNotificationDate = null;

  const checkAndSendDailyNotifications = async () => {
    try {
      const nowISTString = new Date().toLocaleString("en-US", {
        timeZone: "Asia/Kolkata",
      });
      const nowIST = new Date(nowISTString);

      const currentHour = nowIST.getHours();
      const currentMinute = nowIST.getMinutes();
      const todayDateStr = nowIST.toISOString().slice(0, 10);

      if (
        currentHour === 9 &&
        currentMinute === 0 &&
        lastNotificationDate !== todayDateStr
      ) {
        console.log("Triggering due payment notifications at 9:00 AM IST");
        await handleDuePaymentNotification(io);
        lastNotificationDate = todayDateStr;
      }
    } catch (error) {
      console.error("Error in daily notification scheduler:", error);
    }
  };

  // Call every minute
  setInterval(checkAndSendDailyNotifications, 60 * 1000);
  let lastDemoExpiryCheck = null;

 const handleDemoExpiryNotifications = async () => {
  try {
    const now = new Date();
    const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);
    const windowMinutes = 5; // +/- 5 min window
    const windowEnd = new Date(oneHourLater.getTime() + windowMinutes * 60 * 1000);

    // 1️⃣ Reset flag for demo users whose plan is about to expire (if needed)
    await User.updateMany(
      {
        isDemo: true,
        notifiedDemoExpiry: true,
        expiresAt: { $gte: oneHourLater, $lte: windowEnd },
      },
      { $set: { notifiedDemoExpiry: false } }
    );

    // 2️⃣ Find demo users to notify (flag is false, expires in next hour)
    const demoUsers = await User.find({
      isDemo: true,
      notifiedDemoExpiry: false,
      expiresAt: { $gte: now, $lte: oneHourLater },
    });

    for (const user of demoUsers) {
      // 3️⃣ Atomically set notifiedDemoExpiry = true to prevent duplicate emails
      const updatedUser = await User.findOneAndUpdate(
        { _id: user._id, notifiedDemoExpiry: false },
        { $set: { notifiedDemoExpiry: true } },
        { new: true }
      );

      if (!updatedUser) continue; // Already processed

      // 4️⃣ Send demo expiry email
      await sendDemoExpiryEmail(user.email, user.firstName || "User", user);
      console.log(`✅ Demo expiry email sent to ${user.email}`);
    }
  } catch (error) {
    console.error("❌ Error handling demo expiry notifications:", error);
  }
};

setInterval(handleDemoExpiryNotifications, 60 * 1000);

  // MongoDB change streams
  const notificationChangeStream = Notification.watch();
  notificationChangeStream.on("change", async (change) => {
    const { operationType, documentKey, fullDocument, updateDescription } =
      change;
    if (operationType === "insert") {
      handleNewNotification(io, fullDocument);
    } else if (operationType === "update") {
      handleNotificationUpdate(io, updateDescription, documentKey);
    } else if (operationType === "delete") {
      handleNotificationDelete(io, documentKey);
    }
  });

  const inventoryChangeStream = Item.watch();
  inventoryChangeStream.on("change", async (change) => {
    const { operationType, documentKey, updateDescription } = change;
    if (
      operationType === "update" &&
      updateDescription.updatedFields?.quantity !== undefined
    ) {
      await handleCriticalItemNotification(io, documentKey._id);
    }
  });
};

const getSocketInstance = () => io;

module.exports = { initializeSocket, getSocketInstance };
