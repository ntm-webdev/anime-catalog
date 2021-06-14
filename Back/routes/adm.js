const express = require("express");
const { body } = require("express-validator");

const admController = require("../controllers/admController");
const authMiddleware = require("../middlewares/auth");

const router = express.Router();

router.get("/my-area", authMiddleware, admController.myArea);
router.post("/add-watchlist", authMiddleware, admController.addWatchlist);
router.post(
  "/add-anime",
  [
    body("title").isLength({ min: 3 }).withMessage("Invalid title."),
    body("genre").not().isEmpty().withMessage("Invalid genre."),
    body("description").not().isEmpty().withMessage("Invalid description."),
    body("releaseDate").not().isEmpty().withMessage("Invalid release date."),
    body("episodes").not().isEmpty().withMessage("Invalid episode."),
    body("trailer").not().isEmpty().withMessage("Invalid trailer."),
  ],
  authMiddleware,
  admController.addAnime
);
router.post(
  "/add-feedback",
  [
    body("comment").not().isEmpty().withMessage("Invalid trailer."),
    body("rating").not().isEmpty().withMessage("Invalid rating."),
  ],
  authMiddleware,
  admController.addFeedback
);
router.delete("/remove-feedback", authMiddleware, admController.removeFeedback);

module.exports = router;
