import { Server } from 'socket.io';

const io = new Server({
  cors: {
    origin: "http://localhost:3000",
  },
})



// const io = require("socket.io")(8900, {
//   cors: {
//     origin: "http://localhost:3000",
//   },
// });

let onlineUsers = [];

const addUser = (userId, socketId) => {
  !onlineUsers.some((user) => user.userId == userId) &&
    onlineUsers.push({ userId, socketId });
};

const removeUser = (socketId) => {
  onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
};


const getUser = (userId) => {
  return onlineUsers.find((u) =>
    u.userId === (userId));
  // return onlineUsers
};
io.on("connection", (socket) => {
  //when connected
  console.log("a user has connected.");

  //take userId and socketId from user
  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);
    // console.log(onlineUsers)
    io.emit("getUsers", onlineUsers);
  });

  // send and get message
  socket.on("sendMessage", ({ senderId, receiverId, text }) => {
    const receiver = getUser(receiverId);
    console.log(receiver)
    // console.log(text)
    console.log(onlineUsers)
    io.to(receiver?.socketId).emit("getMessage", {
      senderId,
      text,
    });
  });


  //when disconnect 
  socket.on("disconnect", () => {
    console.log("a user disconnected!");
    removeUser(socket.id);
    io.emit("getUsers", onlineUsers);
  });
});
io.listen(8900)