const router = require("express").Router();

const {
  userSignup,
  userLogin,
  checkRole,
  userAuth,
  sendVerificationEmail,
} = require("../Controller/authFunctions");

const {
  endMembership,
  deleteUser,
  changePassword,
  getUser,
} = require("../Controller/userFunctions");

const { getChannelByCreator } = require("../Controller/channelFunctions");

const {
  createPlaylist,
  deletePlaylist,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  getPlayList,
} = require("../Controller/playlistFunctions");

const { subscribe, unsubscribe } = require("../Controller/subFunctions");

const {
  getALlVideos,
  getVideoByName,
  getVideoByChannel,
  getVideoByCreator,
} = require("../Controller/videoFunctions");

router.post("/send-verification-email", async (req, res) => {
  await sendVerificationEmail(req.body, res);
});

router.post("/member-register", async (req, res) => {
  await userSignup(req.body, "member", res);
});
router.post("/member-login", async (req, res) => {
  await userLogin(req.body, "member", res);
});
router.get(
  "/member-protected",
  userAuth,
  checkRole(["member"]),
  async (req, res) => {
    return res.json(`Welcome ${req.name}`);
  }
);

router.put(
  "/member-downgrade",
  userAuth,
  checkRole(["member"]),
  async (req, res) => {
    await endMembership(req, res);
  }
);

router.post(
  "/member-delete",
  userAuth,
  checkRole(["member"]),
  async (req, res) => {
    await deleteUser(req, res);
  }
);

router.post(
  "/member-getInfo",
  userAuth,
  checkRole(["member"]),
  async (req, res) => {
    await getUser(req, res);
  }
);

router.put(
  "/member-changePassword",
  userAuth,
  checkRole(["member"]),
  async (req, res) => {
    await changePassword(req, res);
  }
);

router.get(
  "/member-getVideos",
  userAuth,
  checkRole(["member"]),
  async (req, res) => {
    await getALlVideos(req, res);
  }
);

router.post(
  "/member-getVideoByName",
  userAuth,
  checkRole(["member"]),
  async (req, res) => {
    await getVideoByName(req.body, res);
  }
);

router.post(
  "/member-getVideoByChannel",
  userAuth,
  checkRole(["member"]),
  async (req, res) => {
    await getVideoByChannel(req.body, res);
  }
);

router.post(
  "/member-getVideoByCreator",
  userAuth,
  checkRole(["member"]),
  async (req, res) => {
    await getVideoByCreator(req.body, res);
  }
);

router.post(
  "/member-subscribe",
  userAuth,
  checkRole(["member"]),
  async (req, res) => {
    await subscribe(req, res);
  }
);

router.post(
  "/member-unsubscribe",
  userAuth,
  checkRole(["member"]),
  async (req, res) => {
    await unsubscribe(req, res);
  }
);

router.post(
  "/member-createPlaylist",
  userAuth,
  checkRole(["member"]),
  async (req, res) => {
    await createPlaylist(req, res);
  }
);

router.post(
  "/member-deletePlaylist",
  userAuth,
  checkRole(["member"]),
  async (req, res) => {
    await deletePlaylist(req, res);
  }
);

router.put(
  "/member-addVideoToPlaylist",
  userAuth,
  checkRole(["member"]),
  async (req, res) => {
    await addVideoToPlaylist(req, res);
  }
);

router.put(
  "/member-removeVideoFromPlaylist",
  userAuth,
  checkRole(["member"]),
  async (req, res) => {
    await removeVideoFromPlaylist(req, res);
  }
);

router.get(
  "/member-getPlaylist",
  userAuth,
  checkRole(["member"]),
  async (req, res) => {
    await getPlayList(req, res);
  }
);

router.post(
  "/member-getChannelByCreator",
  userAuth,
  checkRole(["creator"]),
  async (req, res) => {
    await getChannelByCreator(req.body, res);
  }
);

module.exports = router;
