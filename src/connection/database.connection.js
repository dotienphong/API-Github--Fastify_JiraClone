const {Pool} = require("pg");
const logger = require("../loggers/loggers.config");

// pg configuration Local
const db = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: Number(process.env.DB_PORT),
  max: 100, // Số lượng kết nối tối đa trong pool
  idleTimeoutMillis: 1500, // Thời gian chờ để giải phóng kết nối không sử dụng, thời gian chờ idle
  connectionTimeoutMillis: 5000, // Thời gian chờ để thiết lập kết nối
});

db.on("connect", (client) => {
  console.log("Database connected successfully");
});

db.on("remove", (client) => {
  console.log("Client removed from pool");
});

db.on("end", () => {
  console.log("Database connection pool has ended.");
});

db.on("error", (err, client) => {
  console.error("Unexpected error on idle client", err);
  logger.error(err);
});

module.exports = db;
