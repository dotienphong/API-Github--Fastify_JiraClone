const escape = require("escape-html");
const logger = require("../../loggers/loggers.config");
const QueryDatabase = require("../../utils/queryDatabase");
const {v4: uuidv4, validate: validateUuid} = require("uuid");

const GetProject = async (req, res, next) => {
  try {
    const sql = `
      SELECT * FROM project;
    `;
    const data = await QueryDatabase(sql);
    return data.rows;
  } catch (error) {
    logger.error(error);
    res.status(500);
    return {code: 500, message: "Internal Server Error"};
  }
};

const GetProjectById = async (req, res, next) => {
  try {
    const id = escape(req.params.id);

    // Kiểm tra xem project_id đúng định dạng uuid ko
    const isValidUuid = validateUuid(id);
    if (isValidUuid == false) {
      res.status(400);
      return {code: 400, message: "Wrong format uuid"};
    }

    const sql = `
    SELECT * FROM project WHERE id='${id}'
    `;

    const data = await QueryDatabase(sql);
    return data.rows;
  } catch (error) {
    logger.error(error);
    res.status(500);
    return {code: 500, message: "Internal Server Error"};
  }
};

const GetProjectByUser = async (req, res, next) => {
  try {
    const email = escape(req.params.email);

    // Kiểm tra xem có truyền vào hay ko
    if (!email) {
      res.status(400);
      return {code: 400, message: "Not have email, please check email again"};
    }

    const sql = `
      SELECT DISTINCT c.*
      FROM task a INNER JOIN "users" b ON a.user_mail = b.email INNER JOIN project c ON a.project_id = c.id 
      WHERE b.email = '${email}'
    `;

    const data = await QueryDatabase(sql);
    return data.rows;
  } catch (error) {
    logger.error(error);
    res.status(500);
    return {code: 500, message: "Internal Server Error"};
  }
};

module.exports = {
  GetProject,
  GetProjectById,
  GetProjectByUser,
};
