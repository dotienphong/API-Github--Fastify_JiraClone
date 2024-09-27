const db = require("../connection/database.connection");
const logger = require("../loggers/loggers.config");

const QueryDatabase = async (sql) => {
  const client = await db.connect();
  try {
    const data = await client.query(sql);
    return data;
  } catch (err) {
    console.error("Database Query Error 🔥:: ");
    logger.error(err);
    throw err; // Ném lại lỗi để xử lý ở nơi gọi hàm
  } finally {
    client.release(); // Luôn giải phóng client, ngay cả khi có lỗi.
  }
};

module.exports = QueryDatabase;
