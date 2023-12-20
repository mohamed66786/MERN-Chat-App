const ChatUsers = require("../models/userModel");
const bcrypt = require("bcrypt");
const asyncHandler = require("express-async-handler");

const login = asyncHandler(async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await ChatUsers.findOne({ username });
    if (!user)
      return res.json({ msg: "Incorrect Username or Password", status: false });
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.json({ msg: "Incorrect Username or Password", status: false });
    delete user.password;
    return res.json({ status: true, user });
  } catch (ex) {
    next(ex);
  }
});

const register = asyncHandler(async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const usernameCheck = await ChatUsers.findOne({ username });
    if (usernameCheck)
      return res.json({ msg: "Username already used", status: false });
    const emailCheck = await ChatUsers.findOne({ email });
    if (emailCheck)
      return res.json({ msg: "Email already used", status: false });
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await ChatUsers.create({
      email,
      username,
      password: hashedPassword,
    });
    delete user.password;
    return res.json({ status: true, user });
  } catch (ex) {
    next(ex);
  }
});

const setAvatar = asyncHandler(async (req, res, next) => {
  try {
    const userId = req.params.id;
    const avatarImage = req.body.image;
    const userData = await ChatUsers.findByIdAndUpdate(
      userId,
      {
        isAvatarImageSet: true,
        avatarImage,
      },
      { new: true }
    );
    return res.json({
      isSet: userData.isAvatarImageSet,
      image: userData.avatarImage,
    });
  } catch (ex) {
    next(ex);
  }
});

const getAllUsers = asyncHandler(async (req, res, next) => {
  try {
    const users = await ChatUsers.find({ _id: { $ne: req.params.id } }).select([
      "email",
      "username",
      "avatarImage",
      "_id",
    ]);
    return res.json(users);
  } catch (error) {
    return next(error);
  }
});

const logOut = asyncHandler(async (req, res, next) => {
  try {
    if (!req.params.id) return res.json({ msg: "User id is required " });
    return res.status(200).send();
  } catch (ex) {
    next(ex);
  }
});

module.exports = {
  login,
  register,
  setAvatar,
  getAllUsers,
  logOut,
};
