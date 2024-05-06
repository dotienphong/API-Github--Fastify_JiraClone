const escape = require("escape-html");
const logger = require("../../loggers/loggers.config");
const QueryDatabase = require("../../utils/queryDatabase");
const {v4: uuidv4, validate: validateUuid} = require("uuid");

const DeleteProject = async (req, res, next) => {
  try {
    const id = escape(req.body.id);

    // Check có truyền vào id hay ko
    if (!id) {
      res.status(400);
      return {code: 400, message: "Missing id"};
    }
    // Kiểm tra xem project_id đúng định dạng uuid ko
    const isValidUuid = validateUuid(id);
    if (isValidUuid == false) {
      res.status(400);
      return {code: 400, message: "Wrong format uuid"};
    }

    // Check id có trong CSDL hay khong
    const checkId = await QueryDatabase(`SELECT * FROM project WHERE id=${"'" + id + "'"}`);
    if (checkId.rowCount === 0) {
      res.status(400);
      return {code: 400, message: "Project not found"};
    }

    const sql = `
      DELETE FROM project WHERE id='${id}';
    `;
    await QueryDatabase(sql);
    return {code: 200, message: "Delete Project success"};
  } catch (error) {
    logger.error(error);
    res.status(500);
    return {code: 500, message: "Internal Server Error"};
  }
};

module.exports = DeleteProject;
