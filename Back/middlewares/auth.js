const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }

  try {
    const token = req.cookies.token;
    if (!token) {
      return res
        .status(401)
        .json({ msg: "You are not authorized to continue." });
    }

    const decodedToken = jwt.verify(token, process.env.JWT_KEY);
    req.decodedToken = decodedToken.userId;
    next();
  } catch (err) {
    return res.status(500).json({ msg: "You are not authorized to continue." });
  }
};
