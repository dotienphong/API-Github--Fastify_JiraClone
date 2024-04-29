const logger = require("../../loggers/loggers.config");
const QueryDatabase = require("../../utils/queryDatabase");

const CreateProject = async (req, res, next) => {
  try {
    // Check name của project tạo mới ko được trùng với cái đã có trong hệ thống
    const checkName = await QueryDatabase(`SELECT * FROM project WHERE name='${req.body.name}'`);
    if (checkName.rowCount > 0) {
      return {code: 400, message: "Project name already exists"};
    }

    const sql = `
      INSERT INTO project (name, payment, time_start , time_end, note, priority) 
      VALUES ('${req.body.name}', '${req.body.payment}', '${req.body.time_start}','${req.body.time_end}' ,'${req.body.note}','${req.body.priority}');
    `;

    await QueryDatabase(sql);
    return {code: 200, message: "Create project success"};
  } catch (error) {
    logger.error(error);
    return {code: 500, message: "Internal Server Error"};
  }
};

module.exports = CreateProject;
