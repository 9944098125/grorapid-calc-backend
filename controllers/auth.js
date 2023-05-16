const User = require("../models/User");
const bcrypt = require("bcryptjs");

exports.register = async (req, res) => {
  try {
    const { username, email, password, photo } = req.body;

    const check = await User.findOne({ email });
    if (check) {
      return res.status(400).json({
        message:
          "This email address already exists,try with a different email address",
      });
    }

    const cryptedPassword = await bcrypt.hash(password, 12);

    const user = await new User({
      username,
      email,
      password: cryptedPassword,
      photo,
    }).save();
    res.status(201).json({
      message: `Your registration was successful ${username}`,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        photo: user.photo,
        message: "Register Success ! please activate your email to start",
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message:
          "the email address you entered is not connected to an account.",
      });
    }
    const check = await bcrypt.compare(password, user.password);
    if (!check) {
      return res.status(400).json({
        message: "Invalid credentials.Please try again.",
      });
    }
    res.status(200).json({
      message: "Login success",
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        photo: user.photo,
      },
    });
  } catch (error) {
    next(error);
  }
};
