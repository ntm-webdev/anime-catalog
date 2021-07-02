const express = require("express");
const { body } = require("express-validator");

const { multer, storage, fileFilter, limits } = require("../middlewares/fileUpload");
const userController = require("../controllers/userController");

const router = express.Router();

router.get("/animes", userController.getAnimes);
router.get("/anime/:id", userController.getAnime);
router.get("/logout", userController.logout);
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Invalid email."),
    body("password").isLength({ min: 4 }).withMessage("Invalid password."),
  ],
  userController.login
);
router.post(
  "/signup",
  multer({ storage, fileFilter, limits }).single("image"),
  [
    body("name").not().isEmpty().withMessage("Invalid name."),
    body("email").isEmail().withMessage("Invalid email."),
    body("password").isLength({ min: 4 }).withMessage("Invalid password."),
    body("confPassword").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("The passwords don't match.");
      }
      return true;
    }),
  ],
  userController.signUp
);

module.exports = router;
