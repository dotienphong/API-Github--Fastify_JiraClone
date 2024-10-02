const escape = require("escape-html");
const QueryDatabase = require("../../utils/queryDatabase");
const logger = require("../../loggers/loggers.config");

const DeleteUser = async (req, res, next) => {
  const id = escape(req.body.id);
  try {
    // Check có truyền vào id hay không
    if (!id || id == undefined || id == null || id == "") {
      res.status(404);
      return {code: 404, message: "Missing id"};
    }

    // Check id có trong CSDL hay không
    const checkId = await QueryDatabase(`SELECT * FROM "users" WHERE id='${id}'`);
    if (checkId.rowCount === 0) {
      res.status(404);
      return {code: 404, message: "User not found"};
    }

    // Write sql checkrole by id
    const checkRole = await QueryDatabase(`SELECT * FROM "users" WHERE id='${id}'`);
    if (checkRole.rows[0].role == 1) {
      res.status(401);
      return {code: 401, message: "Can not delete administrator"};
    }

    const sql = `
      DELETE FROM "users" WHERE id='${id}';
    `;

    await QueryDatabase(sql);
    return {code: 200, message: "Delete user success"};
  } catch (error) {
    logger.error(error);
    res.status(500);
    return {code: 500, message: "Internal Server Error"};
  }
};

module.exports = DeleteUser;
