const bcrypt = require("bcrypt");
const { User } = require("../Database/data");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const nodemailer = require("nodemailer");
const {
  isNotString,
  isNotEmail,
  isNotPsw,
} = require("../validation/validateInputs");

const sendVerificationEmail = async (req, res) => {
  if (isNotString(req.name, "name")) {
    return res.status(400).json({
      message: isNotString(req.name, "name"),
    });
  }

  if (isNotEmail(req.email)) {
    return res.status(400).json({
      message: isNotEmail(req.email),
    });
  }

  if (isNotPsw(req.password)) {
    return res.status(400).json({
      message: isNotPsw(req.password),
    });
  }

  try {
    let emailNotRegistered = await validateEmail(req.email);
    if (!emailNotRegistered) {
      return res.status(400).json({
        message: "Email is already registered",
      });
    }

    const token = jwt.sign(
      {
        email: req.email,
        name: req.name,
        password: req.password,
        role: req.role,
      },
      process.env.APP_SECRET,
      { expiresIn: "3m" }
    );

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "thuhtet149@gmail.com",
        pass: "rjpy yyof fpys seef",
      },
    });

    const verificationLink = `https://thuhtet.com/verify-email?token=${token}`;

    const mailOptions = {
      from: "thuhtet149@gmail.com",
      to: req.email,
      subject: "Email Verification",
      text: `Click the link to verify your email: ${verificationLink}`,
    };

    transporter.sendMail(mailOptions, (error) => {
      if (error) {
        return res.status(500).json(error);
      } else {
        return res.status(200).json({
          message: "Verification email sent. Please check your email.",
        });
      }
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

const userSignup = async (req, role, res) => {
  if (isNotString(req.name, "name")) {
    return res.status(400).json({
      message: isNotString(req.name, "name"),
    });
  }

  if (isNotEmail(req.email)) {
    return res.status(400).json({
      message: isNotEmail(req.email),
    });
  }

  if (isNotPsw(req.password)) {
    return res.status(400).json({
      message: isNotPsw(req.password),
    });
  }

  try {
    let nameNotTaken = await validateMemberName(req.name);
    if (!nameNotTaken) {
      return res.status(400).json({
        message: "User name is already registered",
      });
    }

    let emailNotRegistered = await validateEmail(req.email);
    if (!emailNotRegistered) {
      return res.status(400).json({
        message: "Email is already registered",
      });
    }

    const password = await bcrypt.hash(req.password, 12);
    const newUser = new User({
      ...req,
      password,
      role,
    });

    await newUser.save();
    return res.status(201).json({
      message: "Registered successfully. Please log in.",
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

const validateMemberName = async (name) => {
  let user = await User.findOne({ name });
  return user ? false : true;
};

const validateEmail = async (email) => {
  let user = await User.findOne({ email });
  return user ? false : true;
};

const userLogin = async (req, role, res) => {
  let { name, password } = req;

  const user = await User.findOne({ name });
  if (isNotPsw(password)) {
    return res.status(400).json({
      message: isNotPsw(password),
    });
  }

  if (!user) {
    return res.status(404).json({
      message: "Member not found. Invalid login credentials.",
    });
  }

  if (user.role !== role) {
    return res.status(403).json({
      message: "Please make sure you are logging in from the right portal.",
    });
  }

  const currentTime = new Date().getTime();

  if (user.lockedUntil && currentTime < user.lockedUntil.getTime()) {
    return res.status(423).json({
      message: "",
      lockouEndTime: user.lockedUntil.getTime(),
    });
  }

  let isMatch = await bcrypt.compare(password, user.password);
  if (isMatch) {
    user.failedLoginAttempts = 0;
    user.lockedUntil = null;
    await user.save();

    let token = jwt.sign(
      {
        role: user.role,
        name: user.name,
        email: user.email,
      },
      process.env.APP_SECRET,
      { expiresIn: "3 days" }
    );

    let result = {
      name: user.name,
      role: user.role,
      email: user.email,
      token: token,
      expiresIn: 168,
    };

    return res.status(200).json({
      ...result,
      message: "Logged in successfully",
    });
  } else {
    user.failedLoginAttempts += 1;
    if (user.failedLoginAttempts >= 4) {
      const lockoutDuration = 1 * 60 * 1000;
      user.lockedUntil = new Date(currentTime + lockoutDuration);
      user.failedLoginAttempts = 0;
      await user.save();
      return res.status(423).json({
        message: "",
        lockoutEndTime: user.lockedUntil.getTime(),
      });
    }
    await user.save();
  }

  return res.status(403).json({
    message: "Incorrect credentials",
  });
};

const userAuth = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(403).json({ message: "Missing Token" });
  const token = authHeader.split(" ")[1];

  try {
    jwt.verify(token, process.env.APP_SECRET, (err, decoded) => {
      if (err) return res.status(403).json({ message: "Wrong Token" });
      console.log(decoded.name);
      req.name = decoded.name;
      next();
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const checkRole = (roles) => async (req, res, next) => {
  let { name } = req;

  const user = await User.findOne({ name });

  if (!roles.includes(user.role)) {
    return res.status(404).json("Sorry you do not have access to this route");
  }
  req.user = user;
  next();
};

module.exports = {
  sendVerificationEmail,
  userSignup,
  userLogin,
  checkRole,
  userAuth,
};
