const auth = require("../middleware/auth");
const { getChatRoomMsg } = require("../controllers/messagesController");
const router = require("express").Router();

router.param("id", (req, res, next, id) => {
  req.chatId = id;
  next();
});
router.get("/:id", getChatRoomMsg); // get a particular chat room message.

module.exports = router;
