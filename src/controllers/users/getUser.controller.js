const escape = require("escape-html");
const QueryDatabase = require("../../utils/queryDatabase");
const logger = require("../../loggers/loggers.config");

const GetUser = async (req, res, next) => {
  try {
    const sql = `
      SELECT * FROM "users";
    `;

    const data = await QueryDatabase(sql);
    res.send(
      data.rows.map((row) => {
        delete row.password;
        return row;
      }),
    );
  } catch (error) {
    logger.error(error);
    res.status(500);
    return {code: 500, message: "Internal Server Error"};
  }
};

const GetUserById = async (req, res, next) => {
  try {
    const id = escape(req.params.id);
    const sql = `
      SELECT * FROM "users" WHERE id = '${id}'
    `;

    const data = await QueryDatabase(sql);
    res.send(
      data.rows.map((row) => {
        delete row.password;
        return row;
      }),
    );
  } catch (error) {
    logger.error(error);
    res.status(500);
    return {code: 500, message: "Internal Server Error"};
  }
};

module.exports = {
  GetUser,
  GetUserById,
};
