const { Video, Playlist } = require("../Database/data");
const { isNotString } = require("../validation/validateInputs");

const createPlaylist = async (req, res) => {
  let { name } = req.body;
  if (isNotString(name, "name")) {
    return res.status(400).json({ message: isNotString(name, "name") });
  }

  try {
    const playlist = await Playlist.findOne({ name, creator: req.user._id });
    if (playlist) {
      return res
        .status(400)
        .json({ message: "You cannot have duplicate playlist names" });
    }

    const newPlaylist = new Playlist({
      name,
      creator: req.user._id,
    });

    await newPlaylist.save();
    res.status(201).json({
      message: "Playlist created successfully",
      playlist: newPlaylist.name,
      creator: req.user.name,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const deletePlaylist = async (req, res) => {
  let { name } = req.body;
  if (isNotString(name, "playlist")) {
    return res.status(400).json({ message: isNotString(name, "playlist") });
  }

  try {
    const playlist = await Playlist.findOne({
      name,
      creator: req.user._id,
    });

    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found" });
    }
    await Playlist.deleteOne({ _id: playlist._id });
    return res.status(200).json({ message: "Playlist deleted" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const addVideoToPlaylist = async (req, res) => {
  let { playlistName, videoTitle } = req.body;

  if (isNotString(playlistName, "playlist")) {
    return res
      .status(400)
      .json({ message: isNotString(playlistName, "playlist") });
  }
  if (isNotString(videoTitle, "title")) {
    return res.status(400).json({ message: isNotString(videoTitle, "title") });
  }

  try {
    const playlist = await Playlist.findOne({
      name: playlistName,
      creator: req.user._id,
    });

    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found" });
    }

    const video = await Video.findOne({ title: videoTitle });
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    if (playlist.videos.includes(video._id)) {
      return res.status(400).json({ message: "Video already in playlist" });
    }

    playlist.videos.push(video._id);
    await playlist.save();

    res.status(201).json({
      message: "Video added to playlist",
      playlist: playlist.name,
      video: video.title,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const removeVideoFromPlaylist = async (req, res) => {
  let { playlistName, videoTitle } = req.body;

  if (isNotString(playlistName, "playlist")) {
    return res
      .status(400)
      .json({ message: isNotString(playlistName, "playlist") });
  }
  if (isNotString(videoTitle, "title")) {
    return res.status(400).json({ message: isNotString(videoTitle, "title") });
  }

  try {
    const playlist = await Playlist.findOne({
      name: playlistName,
      creator: req.user._id,
    });
    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found" });
    }

    const video = await Video.findOne({ title: videoTitle });
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    if (!playlist.videos.includes(video._id)) {
      return res.status(400).json({ message: "Video not in playlist" });
    }

    playlist.videos.pull(video._id);
    await playlist.save();

    res.status(200).json({
      message: "Video removed from playlist",
      playlist: playlist.name,
      video: video.title,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const getPlayList = async (req, res) => {
  try {
    const playlists = await Playlist.find({ creator: req.user._id }).populate(
      "creator",
      "name"
    );

    if (playlists.length === 0) {
      return res.status(404).json({ message: "No playlists found" });
    }

    res.status(200).json({
      message: "Playlists found",
      playlists: playlists,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createPlaylist,
  deletePlaylist,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  getPlayList,
};
