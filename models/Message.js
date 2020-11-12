const mongoose = require("mongoose");

//schema to store message for chatrooms
const messageSchema = new mongoose.Schema({
  chatroom: {
    type: mongoose.Schema.Types.ObjectId,
    required: "ChatRoom is required",
    ref: "ChatRoom",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: "User is required",
    ref: "User",
  },
  message: {
    type: String,
    required: "message is required",
  },
});

module.exports = mongoose.model("Message", messageSchema);
