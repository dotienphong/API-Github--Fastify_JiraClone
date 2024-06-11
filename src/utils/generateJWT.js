const jwt = require("jsonwebtoken");

const GenerateAccessToken = (payload) => {
  return jwt.sign(
    payload,
    process.env.ACCESS_TOKEN || "cew3ttPb9223dfsa33f4O4679N2f9d70PHONG0G5fwef1adad76d1f4gvfd3PHONG07c3vffd2734b3fa4",
    {
      expiresIn: process.env.EXPIRES_ACCESS_TOKEN || "1d",
    },
  );
};

const GenerateRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.REFRESH_TOKEN || "4679N2f9d70PHONG0G5fwef1adad76d1f4gvfd3PHONG07c3vffd2734b3fa4", {
    expiresIn: process.env.EXPIRES_REFRESH_TOKEN || "30s",
  });
};

module.exports = {GenerateAccessToken, GenerateRefreshToken};
