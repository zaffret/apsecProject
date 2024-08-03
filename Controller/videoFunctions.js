const { User, Video, Channel } = require("../Database/data");
const { isNotString, isNotURL } = require("../validation/validateInputs");

const uploadVideo = async (req, res) => {
  let { title, url, thumbnail, description, channelName } = req.body;

  if (isNotString(title, "title")) {
    return res.status(400).json({ message: isNotString(title, "title") });
  }

  if (isNotURL(url)) {
    return res.status(400).json({ message: isNotURL(url) });
  }

  if (isNotString(description, "description")) {
    return res
      .status(400)
      .json({ message: isNotString(description, "description") });
  }

  if (isNotString(channelName, "channel name")) {
    return res
      .status(400)
      .json({ message: isNotString(channelName, "channel name") });
  }

  try {
    const existingVideo = await Video.findOne({ title });
    if (existingVideo) {
      return res.status(400).json({ message: "Video title already exists" });
    }

    const channel = await Channel.findOne({
      name: channelName,
      creator: req.user._id,
    });
    if (!channel) {
      return res.status(404).json({ message: "Channel not found" });
    }

    const newVideo = new Video({
      title,
      url,
      thumbnail,
      description,
      creator: req.user._id,
      channel: channel._id,
    });

    if (channel.videosUploaded < channel.videoLimit) {
      await newVideo.save();
      channel.videos.push(newVideo._id);
      channel.videosUploaded += 1;
      await channel.save();

      res.status(201).json({
        message: "Video uploaded successfully",
        title: newVideo.title,
        url: newVideo.url,
        creator: req.user.name,
        channel: channel.name,
      });
    } else {
      return res.status(403).json({
        message: `Channel video limit of ${channel.videoLimit} reached`,
      });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const deleteVideo = async (req, res) => {
  let { title } = req.body;

  if (isNotString(title, "title")) {
    return res.status(400).json({ message: isNotString(title, "title") });
  }

  try {
    const video = await Video.findOne({ title });
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }
    if (req.user.role !== "admin") {
      if (video.creator.toString() !== req.user._id.toStrng()) {
        return res
          .status(403)
          .json({ message: "You can only delete your own video" });
      }
    }
    const channel = await Channel.findOne({ _id: video.channel });
    channel.videos.pull(video._id);
    channel.videosUploaded -= 1;
    await channel.save();

    await Video.deleteOne({ _id: video._id });
    return res.status(200).json({ message: "Video deleted" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const updateVideo = async (req, res) => {
  let { title, newTitle, newthumbnail, newDescription, newChannel } = req.body;

  if (isNotString(title, "title")) {
    return res.status(400).json({ message: isNotString(title, "title") });
  }

  if (isNotString(newTitle, "title")) {
    return res.status(400).json({ message: isNotString(newTitle, "title") });
  }

  if (isNotString(newDescription, "description")) {
    return res
      .status(400)
      .json({ message: isNotString(newDescription, "description") });
  }

  if (isNotString(newChannel, "channel name")) {
    return res
      .status(400)
      .json({ message: isNotString(newChannel, "channel name") });
  }

  try {
    const video = await Video.findOne({ title, creator: req.user._id });
    if (!video) {
      return res
        .status(404)
        .json({ message: "Video not found in your library" });
    }

    const oldChannel = await Channel.findOne({ _id: video.channel });

    const channel = await Channel.findOne({ name: newChannel }).populate(
      "creator",
      "name"
    );
    if (!channel) {
      return res.status(404).json({ message: "Channel not found" });
    }

    video.title = newTitle;
    video.description = newDescription;
    video.thumbnail = newthumbnail;
    video.channel = channel._id;
    video.creator = channel.creator;

    await video.save();
    oldChannel.videos.pull(video._id);
    oldChannel.videosUploaded -= 1;
    await oldChannel.save();
    channel.videos.push(video._id);
    channel.videosUploaded += 1;
    await channel.save();

    return res.status(200).json({
      message: "Video has been updated successfully",
      title: newTitle,
      description: newDescription,
      thumbnail: newthumbnail,
      channel: channel.name,
      owner: channel.creator,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const getALlVideos = async (req, res) => {
  try {
    const videos = await Video.find()
      .populate("creator", "name")
      .populate("channel", "name");

    return res.status(200).json({
      ...videos,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const getVideoByName = async (req, res) => {
  let { title } = req;

  if (isNotString(title, "title")) {
    return res.status(400).json({ message: isNotString(title, "title") });
  }

  try {
    const video = await Video.findOne({ title })
      .populate("creator", "name")
      .populate("channel", "name");
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    return res.status(200).json({
      ...video,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const getVideoByChannel = async (req, res) => {
  let { channelName } = req;

  if (isNotString(channelName, "channel name")) {
    return res
      .status(400)
      .json({ message: isNotString(channelName, "channel name") });
  }

  try {
    const channel = await Channel.findOne({ name: channelName });
    if (!channel) {
      return res.status(404).json({ message: "Channel not found" });
    }

    const videos = await Video.find({ channel: channel._id })
      .populate("creator", "name")
      .populate("channel", "name");

    if (videos.length === 0) {
      return res.status(404).json({ message: "No videos in this channel" });
    }

    return res.status(200).json({
      ...videos,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const getVideoByCreator = async (req, res) => {
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

    const videos = await Video.find({ creator: creator._id })
      .populate("creator", "name")
      .populate("channel", "name");

    if (videos.length === 0) {
      return res.status(404).json({ message: "No videos yet by this creator" });
    }

    return res.status(200).json({
      ...videos,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports = {
  uploadVideo,
  deleteVideo,
  updateVideo,
  getALlVideos,
  getVideoByName,
  getVideoByChannel,
  getVideoByCreator,
};
