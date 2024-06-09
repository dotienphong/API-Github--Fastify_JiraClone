const jwt = require("jsonwebtoken");

const GenerateAccessToken = (payload) => {
  return jwt.sign(payload, process.env.SECRET_TOKEN || "c8a4Pb92H854O4679N2f9d700G50295a7d1adad76d1d1fd37c34273b3fa4", {
    expiresIn: process.env.EXPIRES_ACCESS_TOKEN || "31d",
  });
};

const GenerateRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.SECRET_TOKEN || "c8a4Pb92H854O4679N2f9d700G50295a7d1adad76d1d1fd37c34273b3fa4", {
    expiresIn: process.env.EXPIRES_REFRESH_TOKEN || "30s",
  });
};

module.exports = {GenerateAccessToken, GenerateRefreshToken};
