const db = require("../connection/database.connection");
const logger = require("../loggers/loggers.config");

const QueryDatabase = async (sql) => {
  try {
    const client = await db.connect();
    const data = await client.query(sql);
    client.end(); // Giải phóng client sau khi sử dụng
    return data;
  } catch (err) {
    console.error("Database Query Error 🔥:: ");
    logger.error(err);
    throw err; // Ném lại lỗi để xử lý ở nơi gọi hàm
  }
};

module.exports = QueryDatabase;
