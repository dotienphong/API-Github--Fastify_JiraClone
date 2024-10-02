const escape = require("escape-html");
const logger = require("../../loggers/loggers.config");
const QueryDatabase = require("../../utils/queryDatabase");
const {v4: uuidv4, validate: validateUuid} = require("uuid");

const GetTask = async (req, res, next) => {
  try {
    const sql = `
      SELECT a.*, b.name AS user_name, c.name AS project_name, c.time_start AS project_start, c.time_end AS project_end
      FROM Task a 
      INNER JOIN "users" b ON a."user_mail" = b."email"
      INNER JOIN project c ON a."project_id" = c."id"
    `;
    const data = await QueryDatabase(sql);
    return data.rows;
  } catch (error) {
    logger.error(error);
    res.status(500);
    return {code: 500, message: "Internal Server Error"};
  }
};

const GetTaskById = async (req, res, next) => {
  try {
    const id = escape(req.params.id);

    // Kiểm tra xem project_id đúng định dạng uuid ko
    const isValidUuid = validateUuid(id);
    if (isValidUuid == false) {
      res.status(400);
      return {code: 400, message: "Wrong format uuid"};
    }

    const sql = `
      SELECT a.*, b.name AS user_name, c.name AS project_name, c.time_start AS project_start, c.time_end AS project_end
      FROM Task a 
      INNER JOIN "users" b ON a."user_mail" = b."email"
      INNER JOIN project c ON a."project_id" = c."id"
      WHERE a.id = '${id}'
    `;

    const data = await QueryDatabase(sql);
    return data.rows;
  } catch (error) {
    logger.error(error);
    res.status(500);
    return {code: 500, message: "Internal Server Error"};
  }
};

const GetTaskByProjectId = async (req, res, next) => {
  try {
    const id = escape(req.params.id);

    // Kiểm tra xem project_id đúng định dạng uuid ko
    const isValidUuid = validateUuid(id);
    if (isValidUuid == false) {
      res.status(400);
      return {code: 400, message: "Wrong format uuid"};
    }

    const sql = `
      SELECT a.*, b.name AS user_name, c.name AS project_name, c.time_start AS project_start, c.time_end AS project_end
      FROM Task a 
      INNER JOIN "users" b ON a."user_mail" = b."email"
      INNER JOIN project c ON a."project_id" = c."id"
      WHERE c.id = '${id}'
    `;
    const data = await QueryDatabase(sql);
    if (data.rowCount === 0) {
      return {code: 200, message: "No task found"};
    }
    return data.rows;
  } catch (error) {
    logger.error(error);
    res.status(500);
    return {code: 500, message: "Internal Server Error"};
  }
};

const GetTaskByUser = async (req, res, next) => {
  try {
    const id = escape(req.params.id);
    const sql = `
      SELECT a.*, b.name AS user_name, c.name AS project_name, c.time_start AS project_start, c.time_end AS project_end
      FROM Task a 
      INNER JOIN "users" b ON a."user_mail" = b."email"
      INNER JOIN project c ON a."project_id" = c."id"
      WHERE b.id = '${id}'
    `;
    const data = await QueryDatabase(sql);
    if (data.rowCount === 0) {
      return {code: 200, message: "No task found"};
    }
    return data.rows;
  } catch (error) {
    logger.error(error);
    res.status(500);
    return {code: 500, message: "Internal Server Error"};
  }
};

module.exports = {
  GetTask,
  GetTaskById,
  GetTaskByProjectId,
  GetTaskByUser,
};
