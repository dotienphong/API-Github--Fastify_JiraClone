"use strict";
require("dotenv").config();
const http = require("http");
const cors = require("@fastify/cors");
const rateLimit = require("@fastify/rate-limit");
const pino = require("pino");
const pretty = require("pino-pretty");
const path = require("path");
const allRouter = require("./routes/routes");

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
  //   origin: "*",
  //   methods: ["GET", "POST", "PUT", "DELETE"],
  //   allowedHeaders: ["Content-Type", "Authorization"],
  //   credentials: true,
});

// Rate-Limit
app.register(rateLimit, {
  timeWindow: 5 * 60 * 1000, // 5 minutes
  max: 5000, // Limit each IP to 5000 requests per `window` (here, per 5 minutes).
  statusCode: 429,
  error: "Too Many Requests",
  message: "Too many requests from this IP 🔥🔥, please try again later !",
});

// ROUTER
app.get("/", async (req, res) => {
  res.send({hello: "Home Page with Fastify"});
});
app.register(allRouter, {prefix: "/api"});

// Run the server!
app.ready(() => {
  server.listen({port: process.env.PORT}, async (err, address) => {
    console.log(`App 🖥️ is running ❤️ on port:: ${process.env.PORT}`);
    if (err) {
      console.warn("Error start server 🔥 :: ", err);
      fastify.log.error(err);
      process.exit(1);
    }
  });
});
