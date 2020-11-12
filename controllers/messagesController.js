const Message = require("../models/Message");

exports.getChatRoomMsg = async (req, res) => {
  const chatId = req.chatId;
  // console.log("the chat Id is ", chatId);
  const messages = await Message.find({ chatroom: chatId }).populate("user");
  return res.json({ messages });
};

