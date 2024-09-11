// const redis = require("redis");

// function createRedisClient() {
//   let redisClient;

//   try {
//     redisClient = redis.createClient({
//       socket: {
//         host: process.env.REDIS_HOST,
//         port: process.env.REDIS_PORT,
//       },
//     });

//     redisClient.on("connect", () => {
//       console.log("Redis connected successfully");
//     });

//     redisClient.on("error", (error) => {
//       console.error("Redis error:", error);
//       process.exit(1);
//     });
//   } catch (error) {
//     console.error("Cannot connect to Redis:", error);
//     process.exit(1);
//   }

//   return redisClient;
// }

// const redisClient = createRedisClient();

// module.exports = redisClient;
