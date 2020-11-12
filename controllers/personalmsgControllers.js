const UserMessage = require("../models/UserMessage");

exports.getPersonalMsg = async (req, res, next) => {
  const owner = req.owner;
  const usermsgwith = req.withUser;
  console.log("history");
  const messages = await UserMessage.find({
    userOwner: owner,
    msgWith: usermsgwith,
  });
  return res.json(messages);
};
