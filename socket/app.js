import { createServer } from "http";
import { Server } from "socket.io";

const httpServer = createServer();

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173", // Update this to match your frontend URL
  },
});

let onlineUsers = [];

const addUser = (userId, socketId) => {
  const userExist = onlineUsers.find((user) => user.userId === userId);
  if (!userExist) {
    onlineUsers.push({ userId, socketId });
  }
};

const removeUser = (socketId) => {
  onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return onlineUsers.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
  // Handle disconnection
  socket.on("newUser", (userId) => {
    addUser(userId, socket.id);
  });

  socket.on("sendMessage", ({ receiverId, data }) => {
    const receiver = getUser(receiverId);
    if (receiver) io.to(receiver.socketId).emit("getMessage", data);
  });
  // Add more event listeners here
  socket.on("disconnect", () => {
    removeUser(socket.id);
  });
});

// Start the server on port 4000
httpServer.listen(4000, () => {
  console.log("Listening on port 4000");
});
