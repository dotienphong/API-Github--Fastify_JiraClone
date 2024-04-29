const logger = require("../../loggers/loggers.config");
const QueryDatabase = require("../../utils/queryDatabase");
const {v4: uuidv4, validate: validateUuid} = require("uuid");

const PutProject = async (req, res, next) => {
  try {
    const name = req.body.name;
    const payment = req.body.payment;
    const time_start = req.body.time_start;
    const time_end = req.body.time_end;
    const note = req.body.note;
    const priority = req.body.priority;
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
      UPDATE project 
      SET name =  '${name}', 
      payment =  '${payment}', 
      time_start = '${time_start}', 
      time_end = '${time_end}', 
      note = '${note}', 
      priority = '${priority}'
      WHERE id =  '${id}'
    `;
    await QueryDatabase(sql);
    return {code: 200, message: "Update project success"};
  } catch (error) {
    logger.error(error);
    return {code: 500, message: "Internal Server Error"};
  }
};

module.exports = PutProject;
