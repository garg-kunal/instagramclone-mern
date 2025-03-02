const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const mongoose = require("mongoose");
const port = process.env.PORT || 5000;
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

app.use("/uploads/biopics", express.static(path.join("uploads", "biopics")));
app.use("/uploads/posts", express.static(path.join("uploads", "posts")));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

const uri = process.env.MONGO_URL;
mongoose.connect(`${uri}`, { useNewUrlParser: true });

const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB database connection established successfully");
});

app.get("/", (req, res) => {
  res.send("Instabar Backend is running");
});

app.use("/user", require("./src/routes/user"));
app.use("/profile", require("./src/routes/profiles"));
app.use("/post", require("./src/routes/post"));
app.use("/user", require("./src/routes/request"));

app.listen(port, (req, res) => {
  console.log("server run at: " + port);
});

module.exports = app;
