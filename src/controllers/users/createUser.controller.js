const escape = require("escape-html");
const {hashPassword} = require("../../utils/hashBcrypt");
const QueryDatabase = require("../../utils/queryDatabase");
const logger = require("../../loggers/loggers.config");

const CreateUser = async (req, res, next) => {
  try {
    if (!req.body) {
      res.status(400).send({status: 400, message: "Missing req.body data"});
    }

    const email = escape(req.body.email);
    const name = escape(req.body.name);
    const password = escape(req.body.password);
    const role = escape(req.body.role);

    if (!email || !name || !password) {
      res.status(400);
      return {code: 400, message: "Missing required fields"};
    }

    // Check user+email ko được trùng với cái đã có trong hệ thống
    const checkEmail = await QueryDatabase(`SELECT * FROM "users" WHERE email='${email}'`);
    const checkName = await QueryDatabase(`SELECT * FROM "users" WHERE name='${name}'`);
    if (checkEmail.rowCount > 0) {
      res.status(409);
      return {code: 409, message: "Email already exists"};
    }
    if (checkName.rowCount > 0) {
      res.status(409);
      return {code: 409, message: "Name already exists"};
    }
    // Hash password
    const hashedPassword = await hashPassword(password);

    const sql = `
      INSERT INTO "users" (name, email, password , role) 
      VALUES ('${name}', '${email}', '${hashedPassword}','0');
    `;

    await QueryDatabase(sql);
    return {code: 201, message: "Create user success"};
  } catch (error) {
    logger.error(error);
    res.status(500);
    return {code: 500, message: "Internal Server Error"};
  }
};

module.exports = CreateUser;
