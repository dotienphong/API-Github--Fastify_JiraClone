const {Pool} = require("pg");

// pg configuration Local
const db = new Pool({
  host: process.env.DB_HOST || "weblearn.ddns.net",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "admin",
  database: process.env.DB_DATABASE || "postgres",
  port: process.env.DB_PORT || "5432",
  max: 100, // Số lượng kết nối tối đa trong pool
  idleTimeoutMillis: 10000, // Thời gian chờ để giải phóng kết nối không sử dụng
  connectionTimeoutMillis: 2000, // Thời gian chờ để thiết lập kết nối
});

module.exports = db;
