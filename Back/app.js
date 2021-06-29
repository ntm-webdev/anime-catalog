require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

const userRoute = require("./routes/user");
const admRoute = require("./routes/adm");

const app = express();

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/app/images", express.static(path.join(__dirname, "/images")));
app.use("/app", userRoute);
app.use("/app/admin", admRoute);

mongoose
  .connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(8080);
  })
  .catch((err) => {
    console.log(err);
  });
