const { Mongoose } = require("mongoose");
const ChatRoom = require("../models/ChatRoom");
const mongoose = require("mongoose");

exports.createChatRoom = async (req, res) => {
  const { name } = req.body;
  console.log("request recived to create cjhatroom");
  try {
    if (!name) {
      return res.json({ error: "Name is required" });
    }

    const chatroomExists = await ChatRoom.find({ name });
    if (chatroomExists.length > 0) {
      return res.json({ error: "Chat Room already exits" });
    }

    const chatroom = new ChatRoom({ name });

    await chatroom.save();
    res.json({
      message: `${name} chatroom created `,
    });
  } catch (err) {
    res.status(400).json({ error: "Sorry" });
  }
};

exports.getAllChatRooms = async (req, res) => {
  const chatrooms = await ChatRoom.find({});

  res.json(chatrooms);
};
