import { io } from "socket.io-client";

// For local testing
const socket = io("http://localhost:7200", {
  transports: ["websocket"],
  withCredentials: true,
});

// For Production

// const socket = io("https://aamobee.com", {
//   transports: ["websocket"],
//   withCredentials: true,
// });

// Listen for demo log updates from server
socket.on("demoLogUpdated", (updatedLog) => {
  // console.log("Demo log updated on server:", updatedLog);
});

// Listen for notifications from server
socket.on("newNotification", (notification) => {
  console.log("Received notification:", notification);
});

export const sendDemoLog = ({
  demoUserId,
  actionLogs = [],
  routeLogs = [],
}) => {
  if (!demoUserId) return;
    // console.log("🚀 Sending to server:", { demoUserId, actionLogs, routeLogs });

  socket.emit("demoUserAction", {
    demoUserId,
    actionLog: actionLogs,
    routeLog: routeLogs,
  });
};

export default socket;
