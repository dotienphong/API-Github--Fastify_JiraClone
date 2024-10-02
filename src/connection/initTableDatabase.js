const logger = require("../loggers/loggers.config");
const QueryDatabase = require("../utils/queryDatabase");

const initUsersTable = async () => {
  try {
    const checkIsHaveUsers = `
      SELECT EXISTS (
          SELECT 1 
          FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = 'users'
      );
    `;
    const checkIsHaveRowsUsers = `
      SELECT COUNT(*)
      FROM users u 
    `;
    const addUser = `
      INSERT INTO public.users
        ("email", "password", "name", "role")
      VALUES
        ('admin@gmail.com','$2b$10$ZHJTMlQTwGfwUMCqBPDgx.F.PrbksZ6wH6FOHR4m2MY.7fKlN7uyC', 'admin', '1'),
        ('admin1@gmail.com','$2b$10$ZHJTMlQTwGfwUMCqBPDgx.F.PrbksZ6wH6FOHR4m2MY.7fKlN7uyC', 'admin1', '1'),
        ('test@gmail.com','$2b$10$/A1xjClqHMOn9F.lHBm1bekWgK.TTDeJ25.sPfNrzRb1WsPj3bSh.', 'test', '0');  
    `;
    const checkUsers = await QueryDatabase(checkIsHaveUsers);

    if (checkUsers.rows[0].exists === true) {
      const checkRowUsers = await QueryDatabase(checkIsHaveRowsUsers);
      if (checkRowUsers.rows[0].count == 0) {
        await QueryDatabase(addUser);
      }
      return;
    } else {
      const sql = `
        CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
        CREATE TABLE public.Users (
          Id uuid default uuid_generate_v4() NOT NULL,
          Email character varying(50) DEFAULT NULL::character varying,
          Password character varying(100) DEFAULT NULL::character varying,
          Name character varying(50) DEFAULT NULL::character varying,
          Role smallint
        );
      `;
      await QueryDatabase(sql);
      const checkRowUsers = await QueryDatabase(checkIsHaveRowsUsers);
      if (checkRowUsers.rows[0].count == 0) {
        await QueryDatabase(addUser);
      }
    }
  } catch (error) {
    console.log("Error init table Users :: ", error);
    logger.error(error);
  }
};

const initProjectTable = async () => {
  try {
    const checkIsHaveProject = `
      SELECT EXISTS (
          SELECT 1 
          FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = 'project'
      );
    `;
    const checkIsHaveRowsProject = `
      SELECT COUNT(*)
      FROM project p 
    `;
    const addProject = `
      INSERT INTO public.project 
        ( name, payment , time_start  , time_end , Note, Priority )
      VALUES
        ('Dự án ReactJS', 100000.0,'2016-01-29T08:20:23.962','2016-02-29T08:20:23.962', '', 1), 
        ('Dự án Vuejs', 200000.0,'2023-01-29T08:20:23.962','2024-01-29T08:20:23.962', '',1), 
        ('Dự án Angular', 300000.0,'2024-01-29T08:20:23.962','2024-05-29T08:20:23.962', '',1),
        ('Dự án Nodejs', 400000.0,'2023-09-29T08:20:23.962','2024-09-29T08:20:23.962', '',1); 
    `;
    const checkProject = await QueryDatabase(checkIsHaveProject);

    if (checkProject.rows[0].exists === true) {
      const checkRowProject = await QueryDatabase(checkIsHaveRowsProject);
      if (checkRowProject.rows[0].count == 0) {
        await QueryDatabase(addProject);
      }
      return;
    } else {
      const sql = `
        CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
        CREATE TABLE public.Project (
            Id uuid default uuid_generate_v4() NOT NULL,
            Name character varying(50) DEFAULT NULL::character varying,
            Payment numeric(7,1) DEFAULT NULL::numeric,
            Time_Start timestamp DEFAULT NULL::timestamp,
            Time_End timestamp DEFAULT NULL::timestamp,
            Note character varying(200) DEFAULT NULL::character varying,
            Priority smallint
        );
      `;
      await QueryDatabase(sql);
      const checkRowProject = await QueryDatabase(checkIsHaveRowsProject);
      if (checkRowProject.rows[0].count == 0) {
        await QueryDatabase(addProject);
      }
    }
  } catch (error) {
    console.log("Error init table Project :: ", error);
    logger.error(error);
  }
};

const initTaskTable = async () => {
  try {
    const checkIsHaveTask = `
      SELECT EXISTS (
          SELECT 1 
          FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = 'task'
      );
    `;
    const checkIsHaveRowsTask = `
      SELECT COUNT(*)
      FROM task t
    `;
    const addTask = `
        WITH numbered_users AS (
            SELECT 
                email,
                ROW_NUMBER() OVER (ORDER BY RANDOM()) AS users_row_number
            FROM 
                "users"
        ),
        numbered_projects AS (
            SELECT 
                id,
                ROW_NUMBER() OVER (ORDER BY RANDOM()) AS project_row_number
            FROM 
                project
        )
        INSERT INTO public.task (user_mail, project_id, time_start, time_end, note, status)
        SELECT 
            u.email AS user_mail,
            p.id AS project_id,
            '2024-04-14 00:00:00' AS time_start, 
            '2024-05-14 00:00:00' AS time_end,   
            'Note mẫu', -- Thay đổi nội dung ghi chú mặc định tùy theo nhu cầu
            FLOOR(RANDOM() * 3) + 1 AS status -- Chọn status ngẫu nhiên từ 1 đến 3
        FROM 
            numbered_users AS u
        JOIN 
            numbered_projects AS p ON u.users_row_number = p.project_row_number
        LIMIT 10;
      `;

    const checkTask = await QueryDatabase(checkIsHaveTask);

    if (checkTask.rows[0].exists === true) {
      const checkRowTask = await QueryDatabase(checkIsHaveRowsTask);
      if (checkRowTask.rows[0].count == 0) {
        await QueryDatabase(addTask);
      }
      return;
    } else {
      const sql = `
        CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
        CREATE TABLE public.Task (
            Id uuid default uuid_generate_v4() NOT NULL,
            User_Mail character varying(50) DEFAULT NULL::character varying,
            Project_Id uuid not NULL,
            Time_Start timestamp DEFAULT NULL::timestamp,
            Time_End timestamp DEFAULT NULL::timestamp,
            Status smallint,
            Note character varying(200) DEFAULT NULL::character varying
        );
      `;
      await QueryDatabase(sql);
      const checkRowTask = await QueryDatabase(checkIsHaveRowsTask);
      if (checkRowTask.rows[0].count == 0) {
        await QueryDatabase(addTask);
      }
    }
  } catch (error) {
    console.log("Error init table Task :: ", error);
    logger.error(error);
  }
};

const initTableDatabase = async () => {
  try {
    await initUsersTable();
    await initProjectTable();
    await initTaskTable();
    console.log("Init table database PostgreSQL success");
  } catch (error) {
    console.log("Error init table database :: ", error);
    logger.error(error);
  }
};

module.exports = initTableDatabase;
