const { getMaxListeners } = require("../models/Message");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.register = async (req, res) => {
  //console.log("Strted registering you ");
  const { name, email, password } = req.body;

  try {
    const emailRegex = /[@gmail.com|@yahoo.com|@hotmail.com]/;
    if (!emailRegex.test(email)) {
      throw new Error("check email");
    }

    if (password.length < 6) {
      throw new Error("Password must be of characters greater than 6");
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error("user exits");
    }

    const user = new User({ name, email, password });
    const salt = await bcrypt.genSalt(10);

    user.password = await bcrypt.hash(password, salt);
    await user.save();
    res.json({
      message: "user registered succesfully",
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  // console.log("Started logging you inside");
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    // console.log(user);
    if (!user) {
      throw new Error("Please try signing up , No such user exiits!!");
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid Credentials" });
    }
    const token = jwt.sign({ id: user._id }, process.env.SECRET);
    res.json({
      name: user.name,
      token,
      id: user._id,
    });
  } catch (err) {
    res.json({ error: err.message });
  }
};
