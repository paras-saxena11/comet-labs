const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
  let token;
  token = req.cookies.jwtToken;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.SECRET);
      req.user = decoded;
      next();
    } catch (error) {
      res.status(401);
    }
  } else {
    res.status(401);
  }
};

module.exports = authMiddleware;
