const mongoose = require("mongoose");
const express = require("express");
require("dotenv").config();

const userRoutes = require("./public/routes/userRoutes");
const memberRoutes = require("./public/routes/memberRoutes");
const creatorRoutes = require("./public/routes/creatorRoutes");
const adminRoutes = require("./public/routes/adminRoutes");

const cors = require("cors");

mongoose.set("strictQuery", true);

mongoose.connect(process.env.DB_CONNECT).then(() => {
  console.log("MongoDB connected...");
});

const app = express();

const PORT = process.env.PORT || 3000;
const corsOptions = {
  origin: "https://127.0.0.1:5000",
  methods: ["GET", "POST", "PUT", "DELETE"],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public/html')));
app.use(express.urlencoded({ extended: true }));

app.use("", userRoutes);
app.use("", memberRoutes);
app.use("", creatorRoutes);
app.use("", adminRoutes);

// const sslOptions = {
//   key: fs.readFileSync(path.join(__dirname, "key.pem")),
//   cert: fs.readFileSync(path.join(__dirname, "cert.pem")),
// };

// https.createServer(sslOptions, app).listen(PORT, () => {
//   console.log(`HTTPS server running on port ${PORT}`);
//   console.log(
//     `Click here to access  Register Page: https://localhost:${PORT}/html/register.html`
//   );
// });

app.listen(PORT, () => {
  console.log(`HTTP server running on port ${PORT}`);
  console.log(
    `Click here to access  Register Page: http://localhost:${PORT}/html/index.html`
  );
});
