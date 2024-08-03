const router = require("express").Router();

const {
  userSignup,
  userLogin,
  checkRole,
  userAuth,
} = require("../Controller/authFunctions");

const {
  deleteUser,
  changePassword,
  getUser,
} = require("../Controller/userFunctions");

const {
  startChannel,
  deleteChannel,
  changeOwnership,
  changeChannelName,
  getChannelByCreator,
} = require("../Controller/channelFunctions");

const {
  uploadVideo,
  deleteVideo,
  updateVideo,
  getALlVideos,
  getVideoByName,
  getVideoByChannel,
  getVideoByCreator,
} = require("../Controller/videoFunctions");

router.post("/creator-register", async (req, res) => {
  await userSignup(req.body, "creator", res);
});

router.post("/creator-login", async (req, res) => {
  await userLogin(req.body, "creator", res);
});
router.get(
  "/creator-protected",
  userAuth,
  checkRole(["creator"]),
  async (req, res) => {
    return res.json(`Welcome ${req.name}`);
  }
);

router.post(
  "/creator-delete",
  userAuth,
  checkRole(["creator"]),
  async (req, res) => {
    await deleteUser(req, res);
  }
);

router.post(
  "/creator-getInfo",
  userAuth,
  checkRole(["creator"]),
  async (req, res) => {
    await getUser(req, res);
  }
);

router.put(
  "/creator-changePassword",
  userAuth,
  checkRole(["creator"]),
  async (req, res) => {
    await changePassword(req, res);
  }
);

router.get(
  "/creator-getVideos",
  userAuth,
  checkRole(["creator"]),
  async (req, res) => {
    await getALlVideos(req, res);
  }
);

router.post(
  "/creator-getVideoByName",
  userAuth,
  checkRole(["creator"]),
  async (req, res) => {
    await getVideoByName(req.body, res);
  }
);

router.post(
  "/creator-getVideoByChannel",
  userAuth,
  checkRole(["creator"]),
  async (req, res) => {
    await getVideoByChannel(req.body, res);
  }
);

router.post(
  "/creator-getVideoByCreator",
  userAuth,
  checkRole(["creator"]),
  async (req, res) => {
    await getVideoByCreator(req.body, res);
  }
);

router.post(
  "/creator-uploadVideo",
  userAuth,
  checkRole(["creator"]),
  async (req, res) => {
    await uploadVideo(req, res);
  }
);

router.post(
  "/creator-deleteVideo",
  userAuth,
  checkRole(["creator"]),
  async (req, res) => {
    await deleteVideo(req, res);
  }
);

router.put(
  "/creator-updateVideo",
  userAuth,
  checkRole(["creator"]),
  async (req, res) => {
    await updateVideo(req, res);
  }
);

router.post(
  "/creator-startChannel",
  userAuth,
  checkRole(["creator"]),
  async (req, res) => {
    await startChannel(req, res);
  }
);

router.post(
  "/creator-deleteChannel",
  userAuth,
  checkRole(["creator"]),
  async (req, res) => {
    await deleteChannel(req, res);
  }
);

router.put(
  "/creator-changeOwnership",
  userAuth,
  checkRole(["creator"]),
  async (req, res) => {
    await changeOwnership(req, res);
  }
);

router.put(
  "/creator-changeChannelName",
  userAuth,
  checkRole(["creator"]),
  async (req, res) => {
    await changeChannelName(req, res);
  }
);

router.post(
  "/creator-getChannelByCreator",
  userAuth,
  checkRole(["creator"]),
  async (req, res) => {
    await getChannelByCreator(req.body, res);
  }
);

module.exports = router;
