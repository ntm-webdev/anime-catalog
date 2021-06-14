const { validationResult } = require("express-validator");

const Anime = require("../models/anime");
const User = require("../models/user");

module.exports.addAnime = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorsArray = [{}, {}, {}, {}, {}, {}];
    const response_errors = errors.array();

    for (let i = 0; i < response_errors.length; i++) {
      if (response_errors[i].param === "title") {
        errorsArray[0].msg = response_errors[i].msg;
      }
      if (response_errors[i].param === "genre") {
        errorsArray[1].msg = response_errors[i].msg;
      }
      if (response_errors[i].param === "description") {
        errorsArray[2].msg = response_errors[i].msg;
      }
      if (response_errors[i].param === "releaseDate") {
        errorsArray[3].msg = response_errors[i].msg;
      }
      if (response_errors[i].param === "episodes") {
        errorsArray[4].msg = response_errors[i].msg;
      }
      if (response_errors[i].param === "episodes") {
        errorsArray[5].msg = response_errors[5].msg;
      }
    }

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

    const numberOfFeedbacks = existingAnime.feedback.length;
    const arrRatings = existingAnime.feedback.map((el) => el.rating);
    const sumOfRatings = arrRatings.reduce((a, b) => a + b, 0);

    existingAnime.rating = sumOfRatings / numberOfFeedbacks;
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
    const numberOfFeedbacks = existingAnime.feedback.length;

    if (numberOfFeedbacks > 0) {
      const arrRatings = existingAnime.feedback.map((el) => el.rating);
      const sumOfRatings = arrRatings.reduce((a, b) => a + b, 0);

      existingAnime.rating = sumOfRatings / numberOfFeedbacks;
    } else {
      existingAnime.rating = -1;
    }

    await existingAnime.save();
  } catch (error) {
    return res
      .status(500)
      .json({ msg: "Something went wrong, please try again." });
  }

  return res.status(201).json({ msg: "Feedback deleted successfully." });
};
