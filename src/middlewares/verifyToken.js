const jwt = require("jsonwebtoken");
const logger = require("../loggers/loggers.config");

//function check token is have or not
const VerifyToken = (req, res, next) => {
  try {
    if (req.headers["authorization"] == undefined) {
      res.status(401).send({code: 401, message: "Unauthorized"}).end();
    }

    const checkBearer = req.headers["authorization"].includes("Bearer");
    if (!checkBearer) {
      res.status(401).send({code: 401, message: "Do not have Bearer"}).end();
    }

    const token = req.headers["authorization"].replace("Bearer ", "");
    if (!token) {
      res.status(401).send({code: 401, message: "Unauthorized"}).end();
    }

    jwt.verify(
      token,
      process.env.ACCESS_TOKEN || "cew3ttPb9223dfsa33f4O4679N2f9d70PHONG0G5fwef1adad76d1f4gvfd3PHONG07c3vffd2734b3fa4",
      (err, decoded) => {
        if (err) {
          res.status(401).send({code: 401, message: "JWT expired"}).end();
        }
        next();
      },
    );
  } catch (error) {
    logger.error(error);
    res.status(500);
    res.send({code: 500, message: "Internal Server Error"}).end();
  }
};

module.exports = VerifyToken;
// Cách dùng: Muốn verify token ở đâu thì bỏ VerifyToken vào phần route
