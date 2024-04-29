require("dotenv").config();
const app = require("fastify")({
  logger: true,
});
const cors = require("@fastify/cors");
const rateLimit = require("@fastify/rate-limit");
const path = require("path");
const allRouter = require("./routes/routes");

// Apply CORS middleware globally
await app.register(cors, {
  //   origin: "*",
  //   methods: ["GET", "POST", "PUT", "DELETE"],
  //   allowedHeaders: ["Content-Type", "Authorization"],
  //   credentials: true,
});

// Rate-Limit
app.register(rateLimit, {
  timeWindow: 5 * 60 * 1000, // 5 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 5 minutes).
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
app.listen({port: process.env.PORT}, function (err, address) {
  console.log(`App 🖥️ is running ❤️ on port:: ${process.env.PORT}`);
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
});
