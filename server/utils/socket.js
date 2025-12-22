const { Server } = require("socket.io");
const {
  handleUserJoin,
  handleNewNotification,
  handleDuePaymentNotification,
  handleNotificationUpdate,
  handleNotificationDelete,
  handleCriticalItemNotification
} = require("../services/socket.services");

const Notification = require("../schemas/notification.schema");
const Item = require("../schemas/inventoryItem.schema");

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

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });

 let lastNotificationDate = null;

const checkAndSendDailyNotifications = async () => {
  try {
    const nowISTString = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
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

  // MongoDB change streams
  const notificationChangeStream = Notification.watch();
  notificationChangeStream.on("change", async (change) => {
    const { operationType, documentKey, fullDocument, updateDescription } = change;
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
    if (operationType === "update" && updateDescription.updatedFields?.quantity !== undefined) {
      await handleCriticalItemNotification(io, documentKey._id);
    }
  });
};

const getSocketInstance = () => io;

module.exports = { initializeSocket, getSocketInstance };
