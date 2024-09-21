const {Client} = require("pg");
const logger = require("../loggers/loggers.config");

// pg configuration Local
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT,
};

const db = new Client(dbConfig).connect();

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
