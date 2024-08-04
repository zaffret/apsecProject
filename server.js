const mongoose = require("mongoose");
const express = require("express");
const path = require("path");
require("dotenv").config();

const userRoutes = require("./routes/userRoutes");
const memberRoutes = require("./routes/memberRoutes");
const creatorRoutes = require("./routes/creatorRoutes");
const adminRoutes = require("./routes/adminRoutes");
const verifyRoutes = require("./routes/verifyRoutes");

const cors = require("cors");

mongoose.set("strictQuery", true);

mongoose.connect(process.env.DB_CONNECT).then(() => {
  console.log("MongoDB connected...");
});

const app = express();

const PORT = 5000;
const corsOptions = {
  origin: "https://www.thuhtet.com",
  methods: ["GET", "POST", "PUT", "DELETE"],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.static(path.join(__dirname, "html")));
app.use('/js', express.static(path.join(__dirname, "js")));
app.use(express.urlencoded({ extended: true }));

app.use("", userRoutes);
app.use("", memberRoutes);
app.use("", creatorRoutes);
app.use("", adminRoutes);
app.use("",verifyRoutes);

app.post("/verify-captcha", (req, res) => {
  const secretKey = process.env.CAPTCHA_SECRET_KEY;
  const token = req.body.recaptchaResponse;
  const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`;

  fetch(url, {
    method: "post",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
    },
  })
    .then((response) => response.json())
    .then((google_response) => {
      res.json(google_response);
    })
    .catch((error) => {
      res.json({ error: error });
    });
});



app.listen(PORT, () => {
  console.log(`HTTP server running on port ${PORT}`);
  console.log(
    `Click here to access  Register Page: https://thuhtet.com/html/index.html`
  );
});
