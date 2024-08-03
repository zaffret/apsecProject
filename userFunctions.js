const bcrypt = require("bcrypt");

const { User, Channel, BlackList } = require("../Database/data");
const { isNotString, isNotNumber } = require("../validation/validateInputs");

const upgradeMember = async (req, res) => {
  let { name } = req.body;

  if (isNotString(name, "name")) {
    return res.status(400).json({ message: isNotString(name, "name") });
  }

  if (req.user.role !== "admin" && req.user.name !== name) {
    return res
      .status(403)
      .json({ message: "You can only upgrade your own account" });
  }

  const user = await User.findOne({ name, role: "user" });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  user.role = "member";
  await user.save();

  if (req.user.role !== "admin") {
    const authHeader = req.headers["authorization"];
    const token = authHeader.split(" ")[1];

    const blackListed = new BlackList({ token });
    blackListed.save();
  }
  res.status(200).json({ message: `${user.name} has been upgraded to member` });
};

const endMembership = async (req, res) => {
  let { name } = req.body;

  if (isNotString(name, "name")) {
    return res.status(400).json({ message: isNotString(name, "name") });
  }

  if (req.user.role !== "admin" && req.user.name !== name) {
    return res
      .status(403)
      .json({ message: "You can only downgrade your own account" });
  }

  const user = await User.findOne({ name, role: "member" });
  if (!user) {
    return res.status(404).json({ message: "Member not found" });
  }

  if (req.user.role !== "admin") {
    const authHeader = req.headers["authorization"];
    const token = authHeader.split(" ")[1];

    const blackListed = new BlackList({ token });
    blackListed.save();
  }
  user.role = "user";
  await user.save();
  res.status(200).json({ message: `${user.name} membership has ended` });
};

const deleteUser = async (req, res) => {
  let { name } = req.body;

  if (isNotString(name, "name")) {
    return res.status(400).json({ message: isNotString(name, "name") });
  }

  if (req.user.role !== "admin" && req.user.name !== name) {
    return res
      .status(403)
      .json({ message: "You can only delete your own account" });
  }

  const user = await User.findOne({ name });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  await User.deleteOne({ _id: user._id });
  res.status(200).json({ message: "User has been removed" });
};

const changeChannelLimit = async (req, res) => {
  let { name, newLimit } = req;

  if (isNotString(name, "name")) {
    return res.status(400).json({ message: isNotString(name, "name") });
  }

  if (isNotNumber(newLimit, "channel limit")) {
    return res
      .status(400)
      .json({ message: isNotNumber(newLimit, "channel limit") });
  }

  const user = await User.findOne({ name });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  if (newLimit < 3) {
    return res.status(400).json({ message: "Minimum limit 3" });
  }
  user.channelLimit = newLimit;
  await user.save();
  res.status(200).json({ message: "Channel limit has been changed" });
};

const changeVideoLimit = async (req, res) => {
  let { name, newLimit } = req;

  if (isNotString(name, "name")) {
    return res.status(400).json({ message: isNotString(name, "name") });
  }
  if (isNotNumber(newLimit, "video limit")) {
    return res
      .status(400)
      .json({ message: isNotNumber(newLimit, "video limit") });
  }

  const channel = await Channel.findOne({ name });
  if (!channel) {
    return res.status(404).json({ message: "Channel not found" });
  }

  if (newLimit < 25) {
    return res.status(400).json({ message: "Minimum limit 25" });
  }
  channel.videoLimit = newLimit;

  await channel.save();
  res.status(200).json({ message: "Video limit has been changed" });
};

const changePassword = async (req, res) => {
  let { name, oldPassword, newPassword } = req.body;

  if (isNotString(name, "name")) {
    return res.status(400).json({ message: isNotString(name, "name") });
  }
  if (isNotString(oldPassword, "old password")) {
    return res
      .status(400)
      .json({ message: isNotString(oldPassword, "old password") });
  }
  if (isNotString(newPassword, "new password")) {
    return res
      .status(400)
      .json({ message: isNotString(newPassword, "new password") });
  }

  if (req.user.name !== name) {
    return res
      .status(403)
      .json({ message: "You can only change your own password" });
  }

  const user = await User.findOne({ name });

  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Incorrect password" });
  }

  user.password = await bcrypt.hash(newPassword, 12);
  await user.save();
  res.status(200).json({ message: "Password has been changed" });
};

const getUser = async (req, res) => {
  let { name } = req.body;

  if (isNotString(name, "name")) {
    return res.status(400).json({ message: isNotString(name, "name") });
  }

  if (req.user.role === "user" && req.user.name !== name) {
    return res
      .status(403)
      .json({ message: "You can only see your own account" });
  }

  const user = await User.findOne({ name });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const result = {
    name: user.name,
    role: user.role,
    channelsCreated: user.channelsCreated,
  };
  res.status(200).json({ ...result });
};

const getAllUsers = async (req, res) => {
  const users = await User.find();
  res.status(200).json({ users });
};

module.exports = {
  upgradeMember,
  endMembership,
  deleteUser,
  changeChannelLimit,
  changeVideoLimit,
  changePassword,
  getUser,
  getAllUsers,
};
