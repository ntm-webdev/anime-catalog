const { validationResult } = require("express-validator");

const Anime = require("../models/anime");
const User = require("../models/user");
const { calculateFeedback } = require("../lib/helpers");

module.exports.addAnime = async (req, res) => {
  const errors = validationResult(req);
  let errorsArray = [{}, {}, {}, {}, {}, {}, {}];
  
  if (!errors.isEmpty()) {
    const response_errors = errors.array();
    errorsArray = response_errors.map((err) => ({ msg: err.msg }));
    return res.status(422).json({ errors: errorsArray });
  }

  if (!req.file || req.fileValidationError) {
    errorsArray[6] = { msg: "Invalid image." };
    return res.status(422).json({ errors: errorsArray });
  }

  const newAnime = new Anime({
    title: req.body.title,
    genre: req.body.genre,
    description: req.body.description,
    image: req.file.originalname,
    rating: -1,
    release_date: req.body.releaseDate,
    episodes: req.body.episodes,
    trailer: req.body.trailer,
    usersWannaWatch: [],
    feedback: [],
  });

  try {
    await newAnime.save();
  } catch (err) {
    return res
      .status(500)
      .json({ msg: "Something went wrong, please try again." });
  }

  return res.status(201).json({ msg: "The anime was added successfully." });
};

module.exports.addWatchlist = async (req, res) => {
  let existingUser;
  try {
    existingUser = await User.findById(req.body.userId);
  } catch (err) {
    return res
      .status(500)
      .json({ msg: "Something went wrong, please try again.1" });
  }

  let existingAnime;
  try {
    existingAnime = await Anime.findById(req.body.animeId);
  } catch (err) {
    return res
      .status(500)
      .json({ msg: "Something went wrong, please try again.2" });
  }

  try {
    if (req.body.isAdding) {
      existingUser.watchList.push(req.body.animeId);
      existingAnime.usersWannaWatch.push(req.body.userId);
    } else {
      existingUser.watchList.pull(req.body.animeId);
      existingAnime.usersWannaWatch.pull(req.body.userId);
    }
    await existingUser.save();
    await existingAnime.save();
  } catch (err) {
    return res
      .status(500)
      .json({ msg: "Something went wrong, please try again.3" });
  }

  return res
    .status(201)
    .json({ msg: "The anime was added to your watch list" });
};

module.exports.myArea = async (req, res) => {
  let existingUser;
  try {
    existingUser = await User.findById(req.query.userId)
      .populate("watchList")
      .populate("feedback");
  } catch (err) {
    return res
      .status(500)
      .json({ msg: "Something went wrong, please try again." });
  }

  return res.status(201).json({ fetchedData: existingUser });
};

module.exports.addFeedback = async (req, res) => {
  let existingUser;
  try {
    existingUser = await User.findById(req.body.userId);
  } catch (err) {
    return res
      .status(500)
      .json({ msg: "Something went wrong, please try again." });
  }

  let existingAnime;
  try {
    existingAnime = await Anime.findById(req.body.animeId);
  } catch (err) {
    return res
      .status(500)
      .json({ msg: "Something went wrong, please try again." });
  }

  try {
    if (req.body.feedbackId) {
      const selectedFeedback = existingAnime.feedback.find(
        (el) => el._id == req.body.feedbackId
      );
      selectedFeedback.comment = req.body.comment;
      selectedFeedback.rating = req.body.rating;
    } else {
      existingAnime.feedback.push({
        userid: existingUser._id,
        comment: req.body.comment,
        rating: req.body.rating,
      });
    }

    const rating = calculateFeedback(existingAnime);
    existingAnime.rating = rating;
    await existingAnime.save();

    existingUser.feedback.push(existingAnime._id);
    await existingUser.save();
  } catch (err) {
    return res
      .status(500)
      .json({ msg: "Something went wrong, please try again." });
  }

  return res
    .status(201)
    .json({ msg: "Your feedback was provided successfully" });
};

module.exports.removeFeedback = async (req, res) => {
  let existingUser;
  try {
    existingUser = await User.findById(req.body.userId);
  } catch (err) {
    return res
      .status(500)
      .json({ msg: "Something went wrong, please try again." });
  }

  let existingAnime;
  try {
    existingAnime = await Anime.findById(req.body.animeId);
  } catch (err) {
    return res
      .status(500)
      .json({ msg: "Something went wrong, please try again." });
  }

  try {
    existingUser.feedback.pull(req.body.animeId);
    await existingUser.save();

    existingAnime.feedback.pull(req.body.feedbackId);
    const rating = calculateFeedback(existingAnime);
    existingAnime.rating = rating;

    await existingAnime.save();
  } catch (error) {
    return res
      .status(500)
      .json({ msg: "Something went wrong, please try again." });
  }

  return res.status(201).json({ msg: "Feedback deleted successfully." });
};
