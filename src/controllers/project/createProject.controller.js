const escape = require("escape-html");
const logger = require("../../loggers/loggers.config");
const QueryDatabase = require("../../utils/queryDatabase");

const CreateProject = async (req, res, next) => {
  try {
    if (!req.body) {
      res.status(400).send({status: 400, message: "Missing req.body data"});
    }

    // Check name của project tạo mới ko được trùng với cái đã có trong hệ thống
    const checkName = await QueryDatabase(`SELECT * FROM project WHERE name='${req.body.name}'`);
    if (checkName.rowCount > 0) {
      res.status(400);
      return {code: 400, message: "Project name already exists"};
    }

    const name = escape(req.body.name);
    const payment = escape(req.body.payment);
    const time_start = escape(req.body.time_start);
    const time_end = escape(req.body.time_end);
    const note = escape(req.body.note);
    const priority = escape(req.body.priority);

    if (!name || !payment || !time_start || !time_end || !priority) {
      res.status(400);
      return {code: 400, message: "Missing required fields"};
    }

    const sql = `
      INSERT INTO project ("name", "payment", "time_start" , "time_end", "note", "priority") 
      VALUES ('${name}', '${payment}', '${time_start}','${time_end}' ,'${note}','${priority}');
    `;

    await QueryDatabase(sql);
    return {code: 200, message: "Create project success"};
  } catch (error) {
    logger.error(error);
    res.status(500);
    return {code: 500, message: error};
  }
};

module.exports = CreateProject;
