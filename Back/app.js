const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

const userRoute = require("./routes/user");
const admRoute = require("./routes/adm");

const app = express();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(multer({ storage }).single("image"));
app.use("/images", express.static(path.join(__dirname, "/images")));
app.use(userRoute);
app.use("/admin", admRoute);

mongoose
  .connect("mongodb://localhost:27017/animeflix", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(8080);
  })
  .catch((err) => {
    console.log(err);
  });
