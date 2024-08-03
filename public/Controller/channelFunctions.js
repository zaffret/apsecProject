const { User, Channel } = require("../Database/data");
const { isNotString } = require("../validation/validateInputs");

const startChannel = async (req, res) => {
  let { name } = req.body;

  if (isNotString(name, "name")) {
    return res.status(400).json({ message: isNotString(name, "name") });
  }

  try {
    const channel = await Channel.findOne({ name: name });
    if (channel) {
      return res.status(400).json({ message: "Channel name already exists" });
    }

    const newChannel = new Channel({
      name,
      creator: req.user._id,
    });

    const creator = await User.findById(req.user._id);

    if (creator.channelsCreated < creator.channelLimit) {
      creator.channelsCreated += 1;
      await creator.save();
      await newChannel.save();
      res.status(201).json({
        message: "Channel created successfully",
        channel: newChannel.name,
        creator: req.user.name,
        video_count: newChannel.videosUploaded,
      });
    } else {
      return res.status(403).json({
        message: `Creator channel limit of ${creator.channelLimit} reached`,
      });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const deleteChannel = async (req, res) => {
  let { name } = req.body;

  if (isNotString(name, "name")) {
    return res.status(400).json({ message: isNotString(name, "name") });
  }

  try {
    const channel = await Channel.findOne({ name });
    if (!channel) {
      return res.status(404).json({ message: "Channel not found" });
    }

    if (req.user.role !== "admin") {
      if (req.user._id.toString() !== channel.creator.toString()) {
        return res
          .status(403)
          .json({ message: "You can only delete your own channel" });
      }
    }

    const creator = await User.findById(channel.creator);
    creator.channelsCreated -= 1;
    await creator.save();

    await Channel.deleteOne({ _id: channel._id });
    return res.status(200).json({ message: "Channel deleted" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const changeOwnership = async (req, res) => {
  let { newOwnerName, channelName } = req.body;

  if (isNotString(newOwnerName, "name")) {
    return res.status(400).json({ message: isNotString(newOwnerName, "name") });
  }

  if (isNotString(channelName, "channel name")) {
    return res
      .status(400)
      .json({ message: isNotString(channelName, "channel name") });
  }

  try {
    const newOwner = await User.findOne({ name: newOwnerName });
    if (!newOwner) {
      return res.status(404).json({ message: "Creator not found" });
    }

    const channel = await Channel.findOne({
      name: channelName,
      creator: req.user._id,
    });
    if (!channel) {
      return res
        .status(404)
        .json({ message: "Channel not found on your account" });
    }

    channel.creator = newOwner._id;

    await channel.save();
    return res.status(200).json({
      message: "Channel ownership changed",
      channel: channel.name,
      creator: newOwner.name,
      video_count: channel.videosUploaded,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const changeChannelName = async (req, res) => {
  let { newName, channelName } = req.body;

  if (isNotString(newName, "name")) {
    return res.status(400).json({ message: isNotString(newName, "name") });
  }

  if (isNotString(channelName, "channel name")) {
    return res
      .status(400)
      .json({ message: isNotString(channelName, "channel name") });
  }

  try {
    const channel = await Channel.findOne({
      name: channelName,
      creator: req.user._id,
    });
    if (!channel) {
      return res
        .status(404)
        .json({ message: "Channel not found on your account" });
    } else {
      const checkChannel = await Channel.findOne({ name: newName });
      if (checkChannel) {
        return res.status(400).json({ message: "Channel name already exists" });
      }
      channel.name = newName;
      await channel.save();
      return res
        .status(200)
        .json({ message: "Channel name changed", newName: channel.name });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const getChannelByCreator = async (req, res) => {
  let { creatorName } = req;

  if (isNotString(creatorName, "creator name")) {
    return res
      .status(400)
      .json({ message: isNotString(creatorName, "creator name") });
  }

  try {
    const creator = await User.findOne({ name: creatorName });
    if (!creator) {
      return res.status(404).json({ message: "Creator not found" });
    }

    const channels = await Channel.find({ creator: creator._id }).populate(
      "creator",
      "name"
    );

    if (channels.length === 0) {
      return res.status(404).json({ message: "No channels" });
    }

    return res.status(200).json({
      ...channels,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports = {
  startChannel,
  deleteChannel,
  changeOwnership,
  changeChannelName,
  getChannelByCreator,
};
