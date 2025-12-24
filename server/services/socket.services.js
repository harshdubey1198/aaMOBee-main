const Notification = require("../schemas/notification.schema");
const User = require("../schemas/user.schema");
const Item = require("../schemas/inventoryItem.schema");
const Invoice = require("../schemas/invoice.schema");
const DemoUserLogs = require("../schemas/demoUserLogs.schema");

const handleUserJoin = async (socket, userId) => {
  socket.join(userId);
  console.log(`User ${userId} joined notifications room.`);

  try {
    const user = await User.findById(userId).populate({
      path: "notifications",
      model: "Notification",
      options: { sort: { date: -1 } },
    });

    if (user) {
      socket.emit("previousNotifications", user.notifications);
    }
  } catch (error) {
    console.error("Error fetching previous notifications:", error);
  }
};

const handleNewNotification = async (io, newNotification) => {
  const { userId, _id } = newNotification;

  try {
    await User.updateOne(
      { _id: userId },
      { $addToSet: { notifications: _id } }
    );
    console.log(`New Notification ID ${_id} added to user ${userId}`);

    io.to(userId.toString()).emit("newNotification", newNotification);
  } catch (error) {
    console.error("Error updating user notifications:", error);
  }
};

const handleNotificationUpdate = async (io, updateDescription, documentKey) => {
  const updatedFields = updateDescription.updatedFields;
  const notificationId = documentKey._id;

  try {
    const notification = await Notification.findById(notificationId);
    if (notification) {
      console.log(`Updated Notification Fields:`, updatedFields);

      io.to(notification.userId.toString()).emit("notificationUpdated", {
        _id: notificationId,
        ...updatedFields,
      });
    }
  } catch (error) {
    console.error("Error fetching updated notification:", error);
  }
};

const handleNotificationDelete = async (io, documentKey) => {
  const deletedNotificationId = documentKey._id;

  try {
    const affectedUser = await User.findOne({
      notifications: deletedNotificationId,
    });

    if (affectedUser) {
      await User.updateOne(
        { _id: affectedUser._id },
        { $pull: { notifications: deletedNotificationId } }
      );

      console.log(
        `Deleted Notification ID ${deletedNotificationId} removed from user ${affectedUser._id}`
      );

      io.to(affectedUser._id.toString()).emit("notificationDeleted", {
        _id: deletedNotificationId,
      });
    }
  } catch (error) {
    console.error("Error handling deleted notification:", error);
  }
};

const handleCriticalItemNotification = async (io, itemId) => {
  console.log(`handleCriticalItemNotification called for item: ${itemId}`);

  try {
    const item = await Item.findById(itemId).populate(
      "firmId",
      "companyTitle adminId"
    );
    if (!item) {
      console.log(`No item found for ID: ${itemId}`);
      return;
    }
    if (item.qtyType === "service") {
      console.log(`Skipping stock alert for service item: ${item.name}`);
      return;
    }

    console.log(`Item found: ${item.name}, Quantity: ${item.quantity}`);

    const [outOfStock, lowStock, criticalStock] = item.criticalStockAlerts || [
      0, 2, 5,
    ];

    if (item.quantity <= criticalStock) {
      console.log(
        `Stock is critical for item: ${item.name} - Quantity: ${item.quantity}`
      );

      let notificationMessage = `Warning! Item "${item.name}" stock is at ${item.quantity}.`;
      if (item.quantity === outOfStock) {
        notificationMessage = `Alert! Item "${item.name}" is out of stock.`;
      } else if (item.quantity <= lowStock) {
        notificationMessage = `Caution! Item "${item.name}" is in low stock (${item.quantity} left).`;
      }

      console.log(`Backend Log: ${notificationMessage}`);

      const usersToNotify = await User.find({
        $or: [
          { _id: item.firmId.adminId, role: "client_admin" },
          {
            adminId: item.firmId._id,
            role: { $in: ["firm_admin", "employee"] },
          },
        ],
      });

      console.log("Firm Admin ID:", item.firmId._id);
      console.log("Client Admin ID:", item.firmId.adminId);
      console.log("Users to notify:", usersToNotify);

      if (usersToNotify.length === 0) {
        console.log("No users found to notify.");
        return;
      }

      for (const user of usersToNotify) {
        let userNotificationMessage = notificationMessage;

        if (user.role === "client_admin" && item.firmId?.companyTitle) {
          userNotificationMessage = `${item.firmId.companyTitle}: ${notificationMessage}`;
        }

        const newNotification = await Notification.create({
          userId: user._id,
          message: userNotificationMessage,
          type: "stock_alert",
        });

        console.log(
          `Notification created for ${user.role} - ID: ${user._id}:`,
          newNotification
        );

        io.to(user._id.toString()).emit("stockAlert", {
          message: userNotificationMessage,
        });
      }

      console.log(
        `Notification sent to firm ${item.firmId.companyTitle} & admin ${
          item.firmId?.adminId || "undefined"
        }`
      );
    } else {
      console.log(`Stock level is sufficient for item: ${item.name}`);
    }
  } catch (error) {
    console.error("Error handling critical item notification:", error);
  }
};

// const handleDuePaymentNotification = async (io) => {
//   try {
//     console.log("Checking for due payment notifications...");

//     const todayStart = new Date();
//     todayStart.setHours(0, 0, 0, 0);

//     const todayEnd = new Date();
//     todayEnd.setHours(23, 59, 59, 999);

//     // Fetch invoices where the due date has passed and status is not 'paid'
//     const dueInvoices = await Invoice.find({
//       status: { $in: ['unpaid', 'partially paid'] },
//       dueDate: { $lte: new Date() }
//     }).populate("firmId", "companyTitle adminId");

//     console.log(`Found ${dueInvoices.length} invoices with due payments.`);

//     for (const invoice of dueInvoices) {
//       if (!invoice?.firmId) {
//         console.log(`Skipping invoice ${invoice.invoiceNumber}: No firm details found.`);
//         continue;
//       }

//       const firm = invoice.firmId;

//       // Check if a notification for this invoice was already created today
//       const existingNotification = await Notification.findOne({
//         userId: firm.adminId,
//         type: "due_payment",
//         relatedId: invoice._id,
//         createdAt: { $gte: todayStart, $lte: todayEnd }
//       });

//       if (existingNotification) {
//         console.log(`Notification for Invoice #${invoice.invoiceNumber} already sent today.`);
//         continue; // Skip this invoice
//       }

//       // Get all relevant users (client admin + firm admin & employees)
//       const usersToNotify = await User.find({
//         $or: [
//           { _id: firm.adminId, role: "client_admin" },
//           { adminId: firm._id, role: { $in: ["firm_admin", "employee"] } }
//         ]
//       });

//       if (usersToNotify.length === 0) {
//         console.log(`No users found for due payment notification of Invoice #${invoice.invoiceNumber}`);
//         continue;
//       }

//       for (const user of usersToNotify) {
//         // Check if this user already received a notification for this invoice today
//         const alreadyNotified = await Notification.findOne({
//           userId: user._id,
//           type: "due_payment",
//           relatedId: invoice._id,
//           createdAt: { $gte: todayStart, $lte: todayEnd },
//         });

//         if (alreadyNotified) {
//           console.log(`Skipping notification: Already sent to user ${user._id} for Invoice #${invoice.invoiceNumber}`);
//           continue;
//         }

//         //Create notification message
//         let notificationMessage = `Payment due for Invoice #${invoice.invoiceNumber}. Amount Due: ₹${invoice.amountDue}`;
//         if (user.role === "client_admin" && firm.companyTitle) {
//           notificationMessage = `${firm.companyTitle}: ${notificationMessage}`;
//         }

//         //Create and send notification
//         const newNotification = await Notification.create({
//           userId: user._id,
//           message: notificationMessage,
//           type: "due_payment",
//           relatedId: invoice._id,
//           date: new Date(),
//         });

//         console.log(`Notification Created for ${user.role} (${user._id}):`, newNotification);

//         io.to(user._id.toString()).emit("duePaymentAlert", {
//           message: notificationMessage,
//           invoiceId: invoice._id,
//         });

//         console.log(` Notification sent to user ${user._id}`);
//       }

//       console.log(`Due payment notifications processed for Invoice #${invoice.invoiceNumber}`);
//     }
//   } catch (error) {
//     console.error("Error handling due payment notifications:", error);
//   }
// };

const handleDuePaymentNotification = async (io) => {
  try {
    console.log("Checking for due payment notifications...");

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    // 1. Fetch due invoices
    const dueInvoices = await Invoice.find({
      status: { $in: ["unpaid", "partially paid"] },
      dueDate: { $lte: todayEnd },
      amountDue: { $gt: 0 },
    }).populate("firmId", "companyTitle adminId");

    console.log(`Found ${dueInvoices.length} invoices with due payments.`);

    for (const invoice of dueInvoices) {
      if (!invoice?.firmId) {
        console.log(
          `Skipping invoice ${invoice.invoiceNumber}: No firm associated.`
        );
        continue;
      }

      const firm = invoice.firmId;

      // 2. Get client admin (user whose _id is firm.adminId and role is 'client_admin')
      const clientAdmin = await User.findOne({
        _id: firm.adminId,
        role: "client_admin",
      });

      // 3. Get firm admins
      const firmAdmins = await User.find({
        adminId: firm._id,
        role: "firm_admin",
      });

      // 4. Get accountants
      const accountants = await User.find({
        adminId: firm._id,
        role: "accountant",
      });

      // 5. Combine all roles to notify
      const rolesToNotify = [
        ...(clientAdmin ? [clientAdmin] : []),
        ...firmAdmins,
        ...accountants,
      ];

      const rolesNotified = new Set(); // Track role-level notification

      for (const user of rolesToNotify) {
        const roleKey = `${user.role}_${invoice._id}`;

        if (rolesNotified.has(roleKey)) continue;

        // Check if user already got a notification for this invoice today
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

        const alreadyNotified = await Notification.findOne({
          userId: user._id,
          type: "due_payment",
          relatedId: invoice._id,
          createdAt: { $gte: twentyFourHoursAgo },
        });

        if (alreadyNotified) {
          console.log(
            `Already notified ${user.role} (${user._id}) for Invoice #${invoice.invoiceNumber}`
          );
          continue;
        }

        // Build role-based message
        let message = `Payment due for Invoice #${invoice.invoiceNumber}. Amount Due: ₹${invoice.amountDue}`;
        if (user.role === "client_admin" && firm.companyTitle) {
          message = `${firm.companyTitle}: ${message}`;
        } else if (user.role === "firm_admin") {
          message = `Admin Alert: ${message}`;
        } else if (user.role === "accountant") {
          message = `Accountant Alert: ${message}`;
        }

        // Create and send notification
        const newNotification = await Notification.create({
          userId: user._id,
          message,
          type: "due_payment",
          relatedId: invoice._id,
          date: new Date(),
        });

        console.log(
          `Notification created for ${user.role} (${user._id}):`,
          newNotification
        );

        io.to(user._id.toString()).emit("duePaymentAlert", {
          message,
          invoiceId: invoice._id,
        });

        rolesNotified.add(roleKey);
      }

      console.log(`Finished processing Invoice #${invoice.invoiceNumber}`);
    }
  } catch (error) {
    console.error("Error handling due payment notifications:", error);
  }
};

const createDemoLog = async ({ demoUserId, actionLogs, routeLogs }) => {
  try {
    // console.log("=== createDemoLog called ===");
    // console.log("Received demoUserId:", demoUserId);
    // console.log("Raw actionLogs:", actionLogs);
    // console.log("Raw routeLogs:", routeLogs);

    // Ensure logs are arrays
    actionLogs = Array.isArray(actionLogs)
      ? actionLogs
      : actionLogs
      ? [actionLogs]
      : [];
    routeLogs = Array.isArray(routeLogs)
      ? routeLogs
      : routeLogs
      ? [routeLogs]
      : [];

    // console.log("Normalized actionLogs:", actionLogs);
    // console.log("Normalized routeLogs:", routeLogs);

    let demoLog = await DemoUserLogs.findOne({ demoUserId });
    // console.log("Existing demoLog found:", !!demoLog);

    if (!demoLog) {
      demoLog = await DemoUserLogs.create({
        demoUserId,
        actionLogs,
        routeLogs,
      });
      console.log("Created new demoLog:", demoLog);
    } else {
      if (actionLogs.length) {
        // console.log(`Appending ${actionLogs.length} action log(s)`);
        demoLog.actionLogs.push(...actionLogs);
      }
      if (routeLogs.length) {
        // console.log(`Appending ${routeLogs.length} route log(s)`);
        demoLog.routeLogs.push(...routeLogs);
      }
      await demoLog.save();
      // console.log("Updated existing demoLog:", demoLog);
    }

    console.log(`Demo log successfully updated for user: ${demoUserId}`);
    return demoLog;
  } catch (error) {
    console.error("Error creating/updating demo log:", error);
    throw error;
  }
};

module.exports = {
  handleUserJoin,
  handleNewNotification,
  handleNotificationUpdate,
  handleNotificationDelete,
  handleCriticalItemNotification,
  handleDuePaymentNotification,
  //demo user logs
  createDemoLog,
};
