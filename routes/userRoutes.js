const router = require("express").Router();

const {
  userSignup,
  userLogin,
  checkRole,
  userAuth,
  sendVerificationEmail,
} = require("../Controller/authFunctions");

const {
  upgradeMember,
  deleteUser,
  changePassword,
  getUser,
} = require("../Controller/userFunctions");

const { getALlVideos } = require("../Controller/videoFunctions");

router.post("/send-verification-email", async (req, res) => {
  await sendVerificationEmail(req.body, res);
});

router.get("/user-publilc", (req, res) => {
  return res.status(200).json({ message: "Public Domain" });
});

router.get("/user", (req, res) => {
  return res.status(200).json({ message: "Public Domain" });
});

router.post("/user-register", async (req, res) => {
  await userSignup(req.body, "user", res);
});

router.post("/user-login", async (req, res) => {
  await userLogin(req.body, "user", res);
});

router.get(
  "/user-protected",
  userAuth,
  checkRole(["user"]),
  async (req, res) => {
    return res.json(`Welcome ${req.name}`);
  }
);

router.put("/user-upgrade", userAuth, checkRole(["user"]), async (req, res) => {
  await upgradeMember(req, res);
});

router.post("/user-delete", userAuth, checkRole(["user"]), async (req, res) => {
  await deleteUser(req, res);
});

router.post(
  "/user-getInfo",
  userAuth,
  checkRole(["user"]),
  async (req, res) => {
    await getUser(req, res);
  }
);

router.put(
  "/user-changePassword",
  userAuth,
  checkRole(["user"]),
  async (req, res) => {
    await changePassword(req, res);
  }
);

router.get(
  "/user-getVideos",
  userAuth,
  checkRole(["user"]),
  async (req, res) => {
    await getALlVideos(req, res);
  }
);

module.exports = router;
