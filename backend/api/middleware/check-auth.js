const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    req.userData = decoded;

    next();
  } catch (error) {
    res.status(400).json({
      message:
        "Invalid token or no token passed. Add authorization header with: Bearer <token>",
    });
  }
};
