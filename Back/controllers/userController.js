const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const Anime = require("../models/anime");
const User = require("../models/user");

module.exports.getAnimes = async (req, res) => {
  try {
    let data;
    if (Object.keys(req.query).length !== 0) {
      let splitted = req.query.sort ? req.query.sort.split(":") : ["", ""];
      data = await Anime.find({ title: new RegExp(splitted[1], "i") });
    } else {
      data = await Anime.find({});
    }
    return res.status(201).json({ fetchedData: data });
  } catch (err) {
    return res
      .status(500)
      .json({ msg: "Something went wrong, please try again later." });
  }
};

module.exports.getAnime = async (req, res) => {
  let data;
  try {
    data = await Anime.findById(req.params.id)
      .populate("usersWannaWatch", "-password")
      .populate({
        path: "feedback",
        populate: {
          path: "userid",
          model: "User",
        },
      });
  } catch (err) {
    if (err.kind == "ObjectId") {
      return res.status("404").json({ msg: "The anime was not found." });
    } else {
      return res
        .status(500)
        .json({ msg: "Something went wrong, please try again later." });
    }
  }

  if (!data) {
    return res.status("404").json({ msg: "The anime was not found." });
  }

  return res.status(201).json({ fetchedData: data });
};

module.exports.signUp = async (req, res) => {
  const errors = validationResult(req);
  let errorsArray = [{}, {}, {}, {}, {}];

  if (!errors.isEmpty()) {
    const response_errors = errors.array();
    errorsArray = response_errors.map((err) => ({ msg: err.msg }));
    return res.status(422).json({ errors: errorsArray });
  }

  if (!req.file || req.fileValidationError) {
    errorsArray[4] = { msg: "Invalid image." };
    return res.status(422).json({ errors: errorsArray });
  }

  let existingUser;
  try {
    existingUser = await User.findOne({ email: req.body.email });
  } catch (error) {
    return res
      .status(500)
      .json({ msg: "Something went wrong, please try again later." });
  }

  if (existingUser) {
    return res.status(500).json({
      msg: "This email is already in use, please use a different one.",
    });
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(req.body.password, 12);
  } catch (err) {
    return res
      .status(500)
      .json({ msg: "Something went wrong, please try again later." });
  }

  const newUser = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
    image: req.file.originalname,
    watchList: [],
  });

  try {
    await newUser.save();
  } catch (err) {
    return res
      .status(500)
      .json({ msg: "Something went wrong, please try again later." });
  }

  let token;
  try {
    token = jwt.sign({ userId: newUser._id }, process.env.JWT_KEY);
    res.cookie("token", token, {
      //expires: new Date(Date.getTime() + 1 * 3600 * 1000),
      httpOnly: true,
      secure: true,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ msg: "Something went wrong, please try again later." });
  }

  return res.status(201).json({
    msg: "The user was added successfully.",
    token: token,
    name: newUser.name,
  });
};

module.exports.login = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const response_errors = errors.array();
    const errorsArray = response_errors.map((err) => ({ msg: err.msg }));

    return res.status(422).json({ errors: errorsArray });
  }

  let existingUser;
  try {
    existingUser = await User.findOne({ email: req.body.email });
  } catch (err) {
    return res
      .status(500)
      .json({ msg: "Something went wrong, please try again" });
  }

  if (!existingUser) {
    return res
      .status(500)
      .json({ msg: "Invalid credentials, please try again." });
  }

  let isPwdValid = false;
  try {
    isPwdValid = await bcrypt.compare(req.body.password, existingUser.password);
  } catch (err) {
    return res.status(500).json({ msg: "Something failed, please try again." });
  }

  if (!isPwdValid) {
    return res
      .status(500)
      .json({ msg: "Invalid credentials, please try again." });
  }

  let token;
  try {
    token = jwt.sign({ userId: existingUser._id }, process.env.JWT_KEY);
    res.cookie("token", token, {
      //expires: new Date(Date.getTime() + 1 * 3600 * 1000),
      httpOnly: true,
      secure: true,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ msg: "Something went wrong, please try again later." });
  }

  return (
    res
      .status(200)
      .json({ token: token, name: existingUser.name })
  );
};

module.exports.logout = async (req, res) => {
  res.clearCookie("token");
  return res.end();
};
