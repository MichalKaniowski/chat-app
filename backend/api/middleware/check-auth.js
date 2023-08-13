const jwt = require("jsonwebtoken");
const axios = require("axios");

module.exports = async (req, res, next) => {
  let refreshToken = "";
  try {
    const autorizationHeader = req.headers.authorization.replace(",", "");
    const token = autorizationHeader.split(" ")[1];
    refreshToken = autorizationHeader.split(" ")[3];

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    req.userData = decoded;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      const response = await axios.post("http://localhost:3000/users/token", {
        refreshToken: refreshToken,
      });

      const token = response.data;
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

      if (token) {
        req.token = token;
        req.userData = decoded;
        return next();
      }
    }
    res.status(401).json({
      message:
        "Invalid token or no token passed. Add authorization header with: Bearer <token>",
    });
  }
};
