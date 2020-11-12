const { register } = require("../controllers/userController");

const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      throw new Error("No Authorization  header pre");
    }

    const token = req.headers.authorization.split(" ")[1];

    const payload = await jwt.verify(token, process.env.SECRET);
    req.payload = payload;

    next();
  } catch (err) {
    res.status(401).json({
      message: err.message + "Forbidden",
    });
  }
};
