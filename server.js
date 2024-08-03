const mongoose = require("mongoose");
const express = require("express");
const path = require("path");
require("dotenv").config();

const userRoutes = require("./routes/userRoutes");
const memberRoutes = require("./routes/memberRoutes");
const creatorRoutes = require("./routes/creatorRoutes");
const adminRoutes = require("./routes/adminRoutes");


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
