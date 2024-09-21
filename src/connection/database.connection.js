const { Client } = require("pg");
const logger = require("../loggers/loggers.config");

// pg configuration Local
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT,
};

const db = async () => {
  const client = new Client(dbConfig);

  try {
    await client.connect();
    console.log("Database connected successfully");

    client.on("end", () => {
      console.log("Database connection has ended.");
    });

    client.on("error", (err) => {
      console.error("Unexpected error on client", err);
      logger.error(err);
    });

    return client; // Return the connected client instance
  } catch (err) {
    console.error("Error connecting to the database", err);
    logger.error(err);
    throw err;
  }
};

module.exports = db;
