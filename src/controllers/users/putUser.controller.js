const escape = require("escape-html");
const QueryDatabase = require("../../utils/queryDatabase");
const logger = require("../../loggers/loggers.config");
const {hashPassword} = require("../../utils/hashBcrypt");

const PutUser = async (req, res, next) => {
  try {
    if (!req.body) {
      res.status(400).send({status: 400, message: "Missing req.body data"});
    }

    const name = escape(req.body.name);
    const email = escape(req.body.email);
    const password = escape(req.body.password);

    if (!name) {
      res.status(404);
      return {code: 404, message: "Missing user name"};
    }

    // Check Email có trong CSDL hay không
    const checkEmail = await QueryDatabase(`SELECT * FROM "users" WHERE email = '${email}'`);
    if (checkEmail.rowCount === 0) {
      res.status(404);
      return {code: 404, message: "Email not found"};
    }
    if (checkEmail.rows[0].email == "admin@gmail.com") {
      res.status(401);
      return {code: 401, message: "Can not change information administrator"};
    }

    if (!password || req.body.password == undefined) {
      const sql = `
        UPDATE "users" 
        SET name = '${name}'
        WHERE email = '${email}' 
      `;
      await QueryDatabase(sql);
      return {code: 200, message: "Update user success"};
    } else {
      const hashedPassword = await hashPassword(password);
      const sql = `
        UPDATE "users" 
        SET password = '${hashedPassword}', name = '${name}'
        WHERE email = '${email}' 
      `;
      await QueryDatabase(sql);
      return {code: 200, message: "Update user success"};
    }
  } catch (error) {
    logger.error(error);
    res.status(500);
    return {code: 500, message: "Internal Server Error"};
  }
};

module.exports = PutUser;
