"use strict";
const path = require("path");
const multer = require("fastify-multer");
const dotenv = require("dotenv");
dotenv.config({
  path: path.join(__dirname, "../.env"),
});
const http = require("http");
const cors = require("@fastify/cors");
const rateLimit = require("@fastify/rate-limit");
const pino = require("pino");
const pretty = require("pino-pretty");
const fastifySwagger = require("@fastify/swagger");
const fastifySwaggerUi = require("@fastify/swagger-ui");
const allRouter = require("./routes/routes");
const initTableDatabase = require("./connection/initTableDatabase");
const redisClient = require("./connection/redis.connection");
const {default: fastifyStatic} = require("fastify-static");

// Create Server
var server;
const serverFactory = (handler, opts) => {
  server = http.createServer((req, res) => {
    handler(req, res);
  });
  return server;
};

// Config Pino-Pretty Logger
const stream = pretty({
  colorize: true,
  translateTime: "SYS:yyyy-mm-dd HH:MM:ss",
  ignore: "pid,reqId,responseTime,req.remotePort,req.remoteAddress",
});
const app = require("fastify")({
  serverFactory,
  logger: pino(stream),
});

// Apply CORS middleware globally
app.register(cors, {
  origin: "*",
  //   methods: ["GET", "POST", "PUT", "DELETE"],
  //   allowedHeaders: ["Content-Type", "Authorization"],
  //   credentials: true,
});

// Đăng ký plugin fastify-multer
app.register(multer.contentParser);

// Rate-Limit
app.register(rateLimit, {
  timeWindow: 5 * 60 * 1000, // 5 minutes
  max: 5000, // Limit each IP to 5000 requests per `window` (here, per 5 minutes).
  statusCode: 429,
  error: "Too Many Requests",
  message: "Too many requests from this IP 🔥🔥, please wait a minutes !",
});

// Swagger
const swaggerOptions = {
  swagger: {
    info: {
      title: "Mockproject API Documentation",
      description: "My Description",
      version: "1.0.0",
    },
    host: "localhost",
    schemes: ["http", "https"],
    consumes: ["application/json"],
    produces: ["application/json"],
    tags: [{name: "Design API", description: "Code related end-points"}],
  },
};
const swaggerUiOptions = {
  routePrefix: "/docs",
  exposeRoute: true,
};
app.register(fastifySwagger, swaggerOptions);
app.register(fastifySwaggerUi, swaggerUiOptions);

// ROUTER
app.get("/", async (req, res) => {
  res.send({hello: "Home Page with Fastify"});
});
app.register(allRouter, {prefix: "/api"});
// Sử dụng fastify-static để phục vụ file tĩnh
app.register(fastifyStatic, {
  root: path.join(__dirname, "uploads/user"), // Đường dẫn tới thư mục chứa ảnh
  prefix: "/api/uploads/user/", // Đường dẫn URL
});

// Run the server!
app.ready(async () => {
  // Init table database
  await initTableDatabase();

  // Redis Connection
  await redisClient.connect();

  // Start server
  server.listen({port: process.env.PORT}, async (err, address) => {
    console.log(`App 🖥️ is running ❤️ on port:: ${process.env.PORT}`);
    if (err) {
      console.warn("Error start server 🔥 :: ", err);
      fastify.log.error(err);
      process.exit(1);
    }
  });
});
