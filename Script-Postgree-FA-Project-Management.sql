
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

CREATE TABLE public.Task (
     Id uuid default uuid_generate_v4() NOT NULL,
    User_Mail character varying(50) DEFAULT NULL::character varying,
    Project_Id uuid not NULL,
    Time_Start timestamp DEFAULT NULL::timestamp,
    Time_End timestamp DEFAULT NULL::timestamp,
    Status smallint,
    Note character varying(200) DEFAULT NULL::character varying
);

CREATE TABLE public.User (
    Id uuid default uuid_generate_v4() NOT NULL,
    Email character varying(50) DEFAULT NULL::character varying,
    Password character varying(100) DEFAULT NULL::character varying,
    Name character varying(50) DEFAULT NULL::character varying,
    Role smallint
);







INSERT INTO public.user
("email", "password", "name", "role")
VALUES
('admin@gmail.com','$2b$10$AQFCuCPJh5/n7t/a2MwzI.eic8ZMfQxSxT6GI6ivDcTJan9bLH7Zy', 'admin', '1'),
('test@gmail.com','$2b$10$/A1xjClqHMOn9F.lHBm1bekWgK.TTDeJ25.sPfNrzRb1WsPj3bSh.', 'test', '0');



INSERT INTO public.project 
  ( name, payment , time_start  , time_end , Note, Priority )
VALUES
  ('Dự án ReactJS', 100000.0,'2016-01-29T08:20:23.962','2016-02-29T08:20:23.962', '', 1), 
  ('Dự án ReactJS', 200000.0,'2023-01-29T08:20:23.962','2024-01-29T08:20:23.962', '',1), 
  ('Dự án Angular', 300000.0,'2024-01-29T08:20:23.962','2024-05-29T08:20:23.962', '',1),
  ('Dự án Nodejs', 400000.0,'2023-09-29T08:20:23.962','2024-09-29T08:20:23.962', '',1);



WITH numbered_users AS (
    SELECT 
        email,
        ROW_NUMBER() OVER (ORDER BY RANDOM()) AS user_row_number
    FROM 
        "user"
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
    '2024-04-14 00:00:00' AS time_start, -- Thay đổi giá trị mặc định tùy theo nhu cầu
    '2024-05-14 00:00:00' AS time_end,   -- Thay đổi giá trị mặc định tùy theo nhu cầu
    'Note mẫu', -- Thay đổi nội dung ghi chú mặc định tùy theo nhu cầu
    FLOOR(RANDOM() * 3) + 1 AS status -- Chọn status ngẫu nhiên từ 1 đến 3
FROM 
    numbered_users AS u
JOIN 
    numbered_projects AS p ON u.user_row_number = p.project_row_number
LIMIT 10;









