const escape = require("escape-html");
const {hashPassword} = require("../../utils/hashBcrypt");
const QueryDatabase = require("../../utils/queryDatabase");
const logger = require("../../loggers/loggers.config");

const CreateUser = async (req, res, next) => {
  try {
    const email = escape(req.body.email);
    const name = escape(req.body.name);
    const password = escape(req.body.password);

    // Check user+email ko được trùng với cái đã có trong hệ thống
    const checkEmail = await QueryDatabase(`SELECT * FROM "user" WHERE email='${email}'`);
    const checkName = await QueryDatabase(`SELECT * FROM "user" WHERE name='${name}'`);
    if (checkEmail.rowCount > 0) {
      res.status(400);
      return {code: 400, message: "Email already exists"};
    }
    if (checkName.rowCount > 0) {
      res.status(400);
      return {code: 400, message: "Name already exists"};
    }
    // Hash password
    const hashedPassword = await hashPassword(password);

    const sql = `
      INSERT INTO "user" (name, email, password , role) 
      VALUES ('${name}', '${email}', '${hashedPassword}','0');
    `;

    await QueryDatabase(sql);
    return {code: 200, message: "Create user success"};
  } catch (error) {
    logger.error(error);
    res.status(500);
    return {code: 500, message: "Internal Server Error"};
  }
};

module.exports = CreateUser;
