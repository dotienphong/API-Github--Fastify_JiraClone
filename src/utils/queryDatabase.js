const logger = require("../loggers/loggers.config");

const db = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT,
  max: 100, // Số lượng kết nối tối đa trong pool
  idleTimeoutMillis: 10000, // Thời gian chờ để giải phóng kết nối không sử dụng
  connectionTimeoutMillis: 2000, // Thời gian chờ để thiết lập kết nối
});

const QueryDatabase = async (sql) => {
  try {
    const client = await db.connect();
    const data = await client.query(sql);
    client.release(); // Giải phóng client sau khi sử dụng
    return data;
  } catch (err) {
    console.error("Database Query Error 🔥:: ");
    logger.error(err);
    throw err; // Ném lại lỗi để xử lý ở nơi gọi hàm
  }
};

module.exports = QueryDatabase;
