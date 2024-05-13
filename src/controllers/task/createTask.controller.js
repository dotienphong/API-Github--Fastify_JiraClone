const escape = require("escape-html");
const logger = require("../../loggers/loggers.config");
const QueryDatabase = require("../../utils/queryDatabase");
const {v4: uuidv4, validate: validateUuid} = require("uuid");

const CreateTask = async (req, res, next) => {
  try {
    // Kiểm tra xem project_id đúng định dạng uuid ko
    const isValidUuid = validateUuid(req.body.project_id);
    if (isValidUuid == false) {
      res.status(400);
      return {code: 400, message: "Wrong format uuid"};
    }

    const user_mail = escape(req.body.user_mail);
    const project_id = escape(req.body.project_id);
    const time_start = escape(req.body.time_start);
    const time_end = escape(req.body.time_end);
    const status = escape(req.body.status);
    const note = escape(req.body.note);

    // Check email + project_id phải trùng với cái đã có trong CSDL
    const checkEmail = await QueryDatabase(`SELECT * FROM "user" WHERE email='${req.body.user_mail}'`);
    const checkProjectId = await QueryDatabase(`SELECT * FROM project WHERE id=${"'" + req.body.project_id + "'"}`);

    if (checkEmail.rowCount > 0 && checkProjectId.rowCount > 0 && isValidUuid == true) {
      const sql = `
        INSERT INTO Task ("user_mail", "project_id", "time_start", "time_end", "status", "note") 
        VALUES (
          '${user_mail}',
          '${project_id}',
          '${time_start}',
          '${time_end}',
          '${status}',
          '${note}'
        );
      `;
      await QueryDatabase(sql);
      return {code: 200, message: "Create task success"};
    } else {
      res.status(400);
      return {code: 400, message: "User or Project not match with database, please check again"};
    }
  } catch (error) {
    logger.error(error);
    res.status(500);
    res.status(500).json({code: 500, message: "Internal Server Error"});
  }
};

module.exports = CreateTask;
