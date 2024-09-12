const redis = require("redis");
const logger = require("../loggers/loggers.config");

function createRedisClient() {
  let redisClient;

  try {
    redisClient = redis.createClient({
      socket: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
      },
    });

    redisClient.on("connect", () => {
      console.log("Redis connected successfully");
    });

    redisClient.on("error", (error) => {
      console.error("Redis error:", error);
      logger.error(err);
    });
  } catch (error) {
    console.error("Cannot connect to Redis:", error);
    logger.error(err);
  }

  return redisClient;
}

const redisClient = createRedisClient();

module.exports = redisClient;
