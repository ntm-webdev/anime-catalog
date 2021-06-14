const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

const Anime = require("../models/anime");
const User = require("../models/user");

const bcrypt = require("bcrypt");

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
      .populate("usersWannaWatch")
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

  if (!errors.isEmpty()) {
    const errorsArray = [{}, {}, {}, {}];
    const response_errors = errors.array();

    for (let i = 0; i < response_errors.length; i++) {
      if (response_errors[i].param === "name") {
        errorsArray[0].msg = response_errors[i].msg;
      }
      if (response_errors[i].param === "email") {
        errorsArray[1].msg = response_errors[i].msg;
      }
      if (response_errors[i].param === "password") {
        errorsArray[2].msg = response_errors[i].msg;
      }
      if (response_errors[i].param === "confPassword") {
        errorsArray[2].msg = response_errors[i].msg;
      }
    }

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
    return res
      .status(422)
      .json({
        msg: "This email is already in use, please use a different one.",
        errors: [],
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
    token = jwt.sign({ userId: newUser._id }, "the_very_secret");
  } catch (err) {
    return res
      .status(500)
      .json({ msg: "Something went wrong, please try again later." });
  }

  return res
    .status(201)
    .json({
      msg: "The user was added successfully.",
      token: token,
      userId: newUser._id,
      name: newUser.name,
    });
};

module.exports.login = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorsArray = [{}, {}];
    const response_errors = errors.array();

    for (let i = 0; i < response_errors.length; i++) {
      if (response_errors[i].param === "email") {
        errorsArray[0].msg = response_errors[i].msg;
      }
      if (response_errors[i].param === "password") {
        errorsArray[1].msg = response_errors[i].msg;
      }
    }

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
    token = jwt.sign({ userId: existingUser._id }, "the_very_secret");
  } catch (err) {
    return res
      .status(500)
      .json({ msg: "Something went wrong, please try again later." });
  }

  return res
    .status(200)
    .json({ token: token, userId: existingUser._id, name: existingUser.name });
};
