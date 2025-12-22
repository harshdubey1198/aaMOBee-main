import { io } from "socket.io-client";

//for production

const socket = io("https://aamobee.com", {
  transports: ["websocket"],
  withCredentials: true
})

//for local testing

// const socket = io("http://localhost:7200", {
//   transports: ["websocket"],
//   withCredentials: true
// })

socket.on("joinRoom", (userId) => {
  socket.join(userId);
  console.log(`User ${socket.id} joined room: ${userId}`);

  setTimeout(() => {
    io.to(userId).emit("newNotification", {
      message: "Test push from server 🚀",
      timestamp: new Date()
    });
  }, 3000);
});


export default socket;
