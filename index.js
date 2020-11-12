const express = require("express");
const app = express();
const http = require("http");
const socketio = require("socket.io");
const server = http.createServer(app);
const cors = require("cors");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("./models/User");
const Message = require("./models/Message");
const { send } = require("process");
const UserMessage = require("./models/UserMessage");
const path = require("path");

require("dotenv").config();

//const http = require('http').createServer(app);

const io = socketio(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: true }));
app.use("/user", require("./routes/user"));
app.use("/chatroom", require("./routes/chatRoom"));
app.use("/message", require("./routes/messages"));
app.use("/pmessage", require("./routes/pmessages"));
app.use(express.static(path.join(__dirname, "../build")));

mongoose.connect(
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ieapc.mongodb.net/chats?retryWrites=true&w=majority`,
  {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  },
  () => {
    console.log("Mongoose cOnnected");
  }
);
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../build"));
});
const port = process.env.PORT || 5400;
server.listen(5400, () => {
  console.log(`Sever is up on port ${port}`);
});

let connectedUsers = []; // maintaing online users
//authenticating sockets
io.use(async (socket, next) => {
  try {
    const token = socket.handshake.query.token;
    const payload = await jwt.verify(token, process.env.SECRET);
    socket.userId = payload.id;
    const user = await User.findById(socket.userId);
    //each time a connection is identified , push the deatils
    let newuser = {};
    newuser.name = user.name;
    newuser.id = socket.id;
    newuser.uid = user._id;
    connectedUsers.push(newuser);
    console.log("Connected");
    console.log(connectedUsers);
    next();
  } catch (err) {
    console.log(err);
  }
});

//establishing connection
io.on("connection", (socket) => {
  console.log("connected:" + socket.userId);

  //online users
  socket.on("getavailableusers", (data) => {
    console.log("received request for available users");
    io.emit("availableusers", connectedUsers);
  });

  //disconnecting -> filter online users
  socket.on("disconnect", async () => {
    const user = await User.findById(socket.userId);
    connectedUsers = connectedUsers.filter((user) => {
      return user.id != socket.id;
    });
    console.log(connectedUsers);
    console.log("Disconnected: " + socket.userId);
  });

  //event when a chatroom is joined
  socket.on("joinRoom", ({ chatRoomId }) => {
    socket.join(chatRoomId);
    console.log("A new user joined the chatRoom" + chatRoomId);
  });

  //user left chatroom
  socket.on("leaveRoom", ({ chatRoomId }) => {
    socket.leave(chatRoomId);
    console.log("A user has left the chatroom" + chatRoomId);
  });

  //mesage received on chatroom -> create a databse mesage and store for reference
  socket.on("chatRoomMessage", async ({ chatRoomId, message }) => {
    if (message.trim().length > 0) {
      const user = await User.findById(socket.userId);
      console.log("user found" + user.name);
      const newmessage = await Message({
        chatroom: chatRoomId,
        user: socket.userId,
        message,
      });
      await newmessage.save();
      io.to(chatRoomId).emit("newMessage", {
        name: user.name,
        message,
        userID: socket.userId,
      });
    }
  });

  //private message -> conversation btw two users
  socket.on(
    "PrivateMessage",
    async ({
      sender,
      receiver,
      message,
      sendername,
      receivername,
      userOwner,
      msgWith,
    }) => {
      console.log("A private message has been received");
      if (message.trim().length > 0) {
        const user = await User.findById(socket.userId);
        console.log(`user found {user.name}`);
        //save msg for both sender and reciver reference
        const senderMsg = new UserMessage({
          userOwner,
          msgWith,
          sender: sendername,
          receiver: receivername,
          content: message,
        });
        await senderMsg.save();
        const receiverMsg = new UserMessage({
          userOwner: msgWith,
          msgWith: userOwner,
          sender: sendername,
          receiver: receivername,
          content: message,
        });
        await receiverMsg.save();
        io.to(receiver).emit("MyPrivateMsg", {
          name: user.name,
          message,
          userId: socket.userId,
          sender: sender,
          receiver: receiver,
        });
        io.to(sender).emit("MyPrivateMsg", {
          name: user.name,
          message,
          userId: socket.userId,
          sender: sender,
          receiver: sender,
        });
      }
    }
  );

  /*socket.on(
    "receivedMyPrivatedMsg",
    async ({ message, userOwner, msgWith, sendername, receivername }) => {
      //console.log(`user found {user.name}`);
      const newuserMsg = new UserMessage({
        userOwner,
        msgWith,
        sender: sendername,
        receiver: receivername,
        content: message,
      });
      await newuserMsg.save();
    }
  );  */
});
