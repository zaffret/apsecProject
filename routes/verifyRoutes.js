const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { User } = require("../Database/data");
require("dotenv").config();

const router = express.Router();

router.get("/verify-email", async (req, res) => {
  const token = req.query.token;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { email, name, password, role } = decoded;

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new User({
      email,
      name,
      password: hashedPassword,
      role,
      isVerified: true,
      verificationToken: null,
    });

    await newUser.save();

    res.redirect("/verification-success.html");
  } catch (err) {
    res.status(400).json({ message: "Invalid or expired token" });
  }
});

module.exports = router;
