const jwt = require("jsonwebtoken");
const logger = require("../loggers/loggers.config");

//function check token is have or not
const VerifyToken = (req, res, next) => {
  try {
    if (req.headers["authorization"] == undefined) {
      res.send({code: 401, message: "Unauthorized"}).end();
    }

    const checkBearer = req.headers["authorization"].includes("Bearer");
    if (!checkBearer) {
      res.send({code: 401, message: "Do not have Bearer"}).end();
    }

    const token = req.headers["authorization"].replace("Bearer ", "");
    if (!token) {
      res.send({code: 401, message: "Unauthorized"}).end();
    }

    jwt.verify(token, process.env.SECRET_TOKEN, (err, decoded) => {
      if (err) {
        res.send({code: 401, message: "JWT expired"}).end();
      }
      next();
    });
  } catch (error) {
    logger.error(error);
    res.send({code: 500, message: "Internal Server Error"}).end();
  }
};

module.exports = VerifyToken;
// Cách dùng: Muốn verify token ở đâu thì bỏ VerifyToken vào phần route
