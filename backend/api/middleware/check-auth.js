const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];

  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

  if (decoded.role === "USER") {
    return res.status(401).json({ message: "Unathorized." });
  }

  req.userData = decoded;
  next();
};
