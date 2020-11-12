const auth = require("../middleware/auth");
const {
  createChatRoom,
  getAllChatRooms,
} = require("../controllers/chatRoomController");

const router = require("express").Router();

router.get("/", auth, getAllChatRooms); // get all the chatrooms available
router.post("/", createChatRoom); // add a new chatroon

module.exports = router;
