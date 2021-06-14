const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .json({ msg: "You are not authorized to continue." });
    }

    const decodedToken = jwt.verify(token, "the_very_secret");
    req.userData = { userId: decodedToken.userId };

    next();
  } catch (err) {
    return res.status(500).json({ msg: "You are not authorized to continue." });
  }
};
