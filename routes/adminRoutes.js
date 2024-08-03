const router = require("express").Router();

const {
  userSignup,
  userLogin,
  checkRole,
  userAuth,
} = require("../Controller/authFunctions");

const {
  upgradeMember,
  endMembership,
  deleteUser,
  changeChannelLimit,
  changeVideoLimit,
  changePassword,
  getUser,
  getAllUsers,
} = require("../Controller/userFunctions");

const {
  deleteChannel,
  getChannelByCreator,
} = require("../Controller/channelFunctions");

const { subscribe, unsubscribe } = require("../Controller/subFunctions");

const {
  deleteVideo,
  getALlVideos,
  getVideoByName,
  getVideoByChannel,
  getVideoByCreator,
} = require("../Controller/videoFunctions");

router.post("/admin-register", async (req, res) => {
  await userSignup(req.body, "admin", res);
});
router.post("/admin-login", async (req, res) => {
  await userLogin(req.body, "admin", res);
});
router.get(
  "/admin-protected",
  userAuth,
  checkRole(["admin"]),
  async (req, res) => {
    return res.json(`Welcome ${req.name}`);
  }
);

router.post(
  "/admin-delete",
  userAuth,
  checkRole(["admin"]),
  async (req, res) => {
    await deleteUser(req, res);
  }
);

router.post(
  "/admin-getInfo",
  userAuth,
  checkRole(["admin"]),
  async (req, res) => {
    await getUser(req, res);
  }
);

router.get(
  "/admin-getAllUsers",
  userAuth,
  checkRole(["admin"]),
  async (req, res) => {
    await getAllUsers(req, res);
  }
);

router.put(
  "/admin-changePassword",
  userAuth,
  checkRole(["admin"]),
  async (req, res) => {
    await changePassword(req, res);
  }
);

router.put(
  "/admin-changeChannelLimit",
  userAuth,
  checkRole(["admin"]),
  async (req, res) => {
    await changeChannelLimit(req.body, res);
  }
);

router.put(
  "/admin-changeVideoLimit",
  userAuth,
  checkRole(["admin"]),
  async (req, res) => {
    await changeVideoLimit(req.body, res);
  }
);

router.put(
  "/admin-upgradeMember",
  userAuth,
  checkRole(["admin"]),
  async (req, res) => {
    await upgradeMember(req, res);
  }
);

router.put(
  "/admin-endMembership",
  userAuth,
  checkRole(["admin"]),
  async (req, res) => {
    await endMembership(req, res);
  }
);

router.get(
  "/admin-getVideos",
  userAuth,
  checkRole(["admin"]),
  async (req, res) => {
    await getALlVideos(req, res);
  }
);

router.post(
  "/admin-getVideoByName",
  userAuth,
  checkRole(["admin"]),
  async (req, res) => {
    await getVideoByName(req.body, res);
  }
);

router.post(
  "/admin-getVideoByChannel",
  userAuth,
  checkRole(["admin"]),
  async (req, res) => {
    await getVideoByChannel(req.body, res);
  }
);

router.post(
  "/admin-getVideoByCreator",
  userAuth,
  checkRole(["admin"]),
  async (req, res) => {
    await getVideoByCreator(req.body, res);
  }
);

router.post(
  "/admin-deleteVideo",
  userAuth,
  checkRole(["admin"]),
  async (req, res) => {
    await deleteVideo(req, res);
  }
);

router.post(
  "/admin-deleteChannel",
  userAuth,
  checkRole(["admin"]),
  async (req, res) => {
    await deleteChannel(req, res);
  }
);

router.post(
  "/admin-getChannelByCreator",
  userAuth,
  checkRole(["admin"]),
  async (req, res) => {
    await getChannelByCreator(req.body, res);
  }
);

router.post(
  "/admin-subscribe",
  userAuth,
  checkRole(["admin"]),
  async (req, res) => {
    await subscribe(req, res);
  }
);

router.post(
  "/admin-unsubscribe",
  userAuth,
  checkRole(["admin"]),
  async (req, res) => {
    await unsubscribe(req, res);
  }
);

module.exports = router;
