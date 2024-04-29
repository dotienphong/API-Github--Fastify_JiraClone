const logger = require("../../loggers/loggers.config");
const QueryDatabase = require("../../utils/queryDatabase");
const {v4: uuidv4, validate: validateUuid} = require("uuid");

const PutTask = async (req, res, next) => {
  try {
    const user_mail = req.body.user_mail;
    const project_id = req.body.project_id;
    const time_start = req.body.time_start;
    const time_end = req.body.time_end;
    const status = req.body.status;
    const note = req.body.note;
    const id = req.body.id;

    // Check có truyền vào id hay ko
    if (!id) {
      return {code: 400, message: "Missing id"};
    }
    // Kiểm tra xem project_id đúng định dạng uuid ko
    const isValidUuid = validateUuid(id);
    if (isValidUuid == false) {
      return {code: 400, message: "Wrong format uuid"};
    }

    const sql = `
      UPDATE task 
      SET user_mail = '${user_mail}', 
      project_id = '${project_id}', 
      time_start = '${time_start}', 
      time_end = '${time_end}', 
      status = '${status}', 
      note = '${note}'
      WHERE id = '${id}'
    `;
    await QueryDatabase(sql);
    return {code: 200, message: "Update task success"};
  } catch (error) {
    logger.error(error);
    return {code: 500, message: "Internal Server Error"};
  }
};

module.exports = PutTask;
