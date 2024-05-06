const escape = require("escape-html");
const QueryDatabase = require("../../utils/queryDatabase");
const logger = require("../../loggers/loggers.config");

const ChangeRoleUser = async (req, res, next) => {
  try {
    const email = escape(req.body.email);
    const role = escape(req.body.role);

    // Check Email có trong CSDL hay không
    const checkEmail = await QueryDatabase(`SELECT * FROM "user" WHERE email = '${email}'`);
    if (checkEmail.rowCount === 0) {
      res.status(400);
      return {code: 400, message: "Email not found"};
    }

    const sql = ` UPDATE "user" SET role = '${role}' WHERE email = '${email}' `;
    await QueryDatabase(sql);
    return {code: 200, message: "Change role user success"};
  } catch (error) {
    logger.error(error);
    res.status(500);
    return {code: 500, message: "Internal Server Error"};
  }
};

module.exports = ChangeRoleUser;
