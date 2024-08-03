const { User, Channel, Subscription } = require("../Database/data");
const { isNotString } = require("../validation/validateInputs");

const subscribe = async (req, res) => {
  let { subscriberName, channelName } = req.body;

  if (isNotString(subscriberName, "name")) {
    return res
      .status(400)
      .json({ message: isNotString(subscriberName, "name") });
  }

  if (isNotString(channelName, "channel name")) {
    return res
      .status(400)
      .json({ message: isNotString(channelName, "channel name") });
  }

  if (req.user.role === "creator") {
    return res
      .status(403)
      .json({ message: "Creators cannot subscribe to channels" });
  }

  if (req.user.role !== "admin" && req.user.name !== subscriberName) {
    return res
      .status(403)
      .json({ message: "You can only subscribe for your own account" });
  }

  try {
    const subscriber = await User.findOne({ name: subscriberName });
    if (!subscriber) {
      return res.status(404).json({ message: "User not found" });
    }

    const channel = await Channel.findOne({ name: channelName });
    if (!channel) {
      return res.status(404).json({ message: "Channel not found" });
    }

    if (channel.subscribers.includes(subscriber._id)) {
      return res.status(400).json({ message: "Already subscribed" });
    }

    const subscription = new Subscription({
      subscriber: subscriber._id,
      channel: channel._id,
    });

    await subscription.save();
    channel.subscribers.push(subscriber._id);
    await channel.save();

    res.status(201).json({
      message: "Subscription successful",
      subscriber: subscriber.name,
      channel: channel.name,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const unsubscribe = async (req, res) => {
  let { subscriberName, channelName } = req.body;

  if (isNotString(subscriberName, "name")) {
    return res
      .status(400)
      .json({ message: isNotString(subscriberName, "name") });
  }

  if (isNotString(channelName, "channel name")) {
    return res
      .status(400)
      .json({ message: isNotString(channelName, "channel name") });
  }

  if (req.user.role !== "admin" && req.user.name !== subscriberName) {
    return res
      .status(403)
      .json({ message: "You can only unsubscribe for your own account" });
  }

  try {
    const subscriber = await User.findOne({ name: subscriberName });
    if (!subscriber) {
      return res.status(404).json({ message: "User not found" });
    }

    const channel = await Channel.findOne({ name: channelName });
    if (!channel) {
      return res.status(404).json({ message: "Channel not found" });
    }

    if (!channel.subscribers.includes(subscriber._id)) {
      return res.status(400).json({ message: "Subscription does not exist" });
    }

    const subscription = await Subscription.findOne({
      subscriber: subscriber._id,
      channel: channel._id,
    });

    await Subscription.deleteOne({ _id: subscription._id });
    channel.subscribers.pull(subscriber._id);
    await channel.save();

    res.status(200).json({
      message: "Unsubscribed",
      user: subscriber.name,
      channel: channel.name,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports = { subscribe, unsubscribe };
