const mongoose = require("mongoose");

//schema to store chatrooms available
const chatroomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: "Name is required",
  },
});

module.exports = mongoose.model("ChatRoom", chatroomSchema);
