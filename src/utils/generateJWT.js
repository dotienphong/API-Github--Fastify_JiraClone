const jwt = require("jsonwebtoken");

const GenerateAccessToken = (payload) => {
  return jwt.sign(payload, process.env.ACCESS_TOKEN, {
    expiresIn: process.env.EXPIRES_ACCESS_TOKEN,
  });
};

const GenerateRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.REFRESH_TOKEN, {
    expiresIn: process.env.EXPIRES_REFRESH_TOKEN,
  });
};

module.exports = {GenerateAccessToken, GenerateRefreshToken};
