const http = require("http");
let server;
const serverFactory = (handler, opts) => {
  server = http.createServer((req, res) => {
    handler(req, res);
  });
  return server;
};

require("dotenv").config();
const app = require("fastify")({
  serverFactory,
  logger: true,
});
const cors = require("@fastify/cors");
const rateLimit = require("@fastify/rate-limit");
const path = require("path");
const allRouter = require("./routes/routes");

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
  max: 1000, // Limit each IP to 1000 requests per `window` (here, per 5 minutes).
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
  server.listen({port: process.env.PORT, host: "127.0.0.1"}, async (err, address) => {
    console.log(address);
    console.log(`App 🖥️ is running ❤️ on port:: ${process.env.PORT}`);
    if (err) {
      fastify.log.error(err);
      process.exit(1);
    }
  });
});
