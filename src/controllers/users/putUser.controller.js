const escape = require("escape-html");
const QueryDatabase = require("../../utils/queryDatabase");
const logger = require("../../loggers/loggers.config");

const PutUser = async (req, res, next) => {
  try {
    const name = escape(req.body.name);
    const email = escape(req.body.email);

    // Check có truyền vào name hay ko: != null
    if (!name) {
      res.status(400);
      return {code: 400, message: "Missing user name"};
    }

    // Check Email có trong CSDL hay không
    const checkEmail = await QueryDatabase(`SELECT * FROM "user" WHERE email = '${email}'`);
    if (checkEmail.rowCount === 0) {
      res.status(400);
      return {code: 400, message: "Email not found"};
    }

    const sql = ` UPDATE "user" SET name = '${name}' WHERE email = '${email}' `;
    await QueryDatabase(sql);
    return {code: 200, message: "Update user success"};
  } catch (error) {
    logger.error(error);
    res.status(500);
    return {code: 500, message: "Internal Server Error"};
  }
};

module.exports = PutUser;
