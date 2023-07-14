const jwt = require("jsonwebtoken");
require("dotenv").config();

const generateToken = (res, email, role) => {
  const token = jwt.sign({ email, role }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  res.cookie("jwtToken", token, {
    httpOnly: true,
    sameSite: "strict",
    maxAge: 3 * 24 * 60 * 60 * 1000,
  });
};
module.exports = generateToken;
