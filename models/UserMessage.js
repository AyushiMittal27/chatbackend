const mongoose = require("mongoose");

//schema to store personal msgs
//userOWner -> a particular user
//msg with -> userOWner chats with

const UserMessageSchema = new mongoose.Schema({
  userOwner: {
    type: mongoose.Schema.Types.ObjectId,
    required: "User is required",
    ref: "ChatRoom",
  },

  msgWith: {
    type: mongoose.Schema.Types.ObjectId,
    required: "User is required",
    ref: "User",
  },
  sender: {
    type: String,
    required: "message is required",
  },
  receiver: {
    type: String,
    required: "message receiver name is required",
  },
  content: {
    type: String,
    required: "Content is required",
  },
});

module.exports = mongoose.model("UserMessage", UserMessageSchema);
