const {upload} = require("../configs/uploadImage");
const {Login, RefreshToken, SignUp, LoginFirebase} = require("../controllers/auth/auth.controller");
const CreateProject = require("../controllers/project/createProject.controller");
const DeleteProject = require("../controllers/project/deleteProject.controller");
const {GetProject, GetProjectById, GetProjectByUser} = require("../controllers/project/getProject.controller");
const PutProject = require("../controllers/project/putProject.controller");
const CreateTask = require("../controllers/task/createTask.controller");
const DeleteTask = require("../controllers/task/deleteTask.controller");
const {GetTask, GetTaskById, GetTaskByProjectId, GetTaskByUser} = require("../controllers/task/getTask.controller");
const PutTask = require("../controllers/task/putTask.controller");
const ChangeRoleUser = require("../controllers/users/changeRoleUser.controller");
const CreateUser = require("../controllers/users/createUser.controller");
const DeleteUser = require("../controllers/users/deleteUser.controller");
const GetAvarta = require("../controllers/users/getAvarta.controller");
const {GetUser, GetUserById} = require("../controllers/users/getUser.controller");
const PutUser = require("../controllers/users/putUser.controller");
const UploadAvarta = require("../controllers/users/uploadAvarta.controller");
const VerifyToken = require("../middlewares/verifyToken");

const router = (router, opts, next) => {
  router.get("/", async (req, res) => {
    res.send({hello: "Home Page with Fastify JiraClone"});
  });

  // Auth + Signup
  router.post("/login", Login);
  router.post("/login/google", LoginFirebase);
  router.get("/refresh-token", RefreshToken);
  router.post("/signup", SignUp);

  // User
  router.get("/user", {onRequest: [VerifyToken]}, GetUser);
  router.get("/user/:id", {onRequest: [VerifyToken]}, GetUserById);
  router.post("/user", CreateUser);
  router.delete("/user", {onRequest: [VerifyToken]}, DeleteUser);
  router.put("/user", {onRequest: [VerifyToken]}, PutUser);
  router.put("/user/changerole", {onRequest: [VerifyToken]}, ChangeRoleUser);

  // Upload Avarta image
  router.route({
    method: "POST",
    url: "/upload/avarta",
    onRequest: [VerifyToken], // Middleware để kiểm tra token trước khi xử lý request
    preHandler: upload.single("image"), // Middleware của Multer để xử lý file upload
    handler: UploadAvarta, // Hàm xử lý upload avarta
  });
  router.get("/avarta/:filename", GetAvarta);

  // Project
  router.get("/project", {onRequest: [VerifyToken]}, GetProject);
  router.get("/project/:id", {onRequest: [VerifyToken]}, GetProjectById);
  router.post("/project", {onRequest: [VerifyToken]}, CreateProject);
  router.delete("/project", {onRequest: [VerifyToken]}, DeleteProject);
  router.put("/project", {onRequest: [VerifyToken]}, PutProject);

  // Task
  router.get("/task", {onRequest: [VerifyToken]}, GetTask);
  router.get("/task/:id", {onRequest: [VerifyToken]}, GetTaskById); //GetTaskDetail
  router.post("/task", {onRequest: [VerifyToken]}, CreateTask);
  router.delete("/task", {onRequest: [VerifyToken]}, DeleteTask);
  router.put("/task", {onRequest: [VerifyToken]}, PutTask);

  // GetTaskBy.......
  router.get("/gettaskbyprojectid/:id", {onRequest: [VerifyToken]}, GetTaskByProjectId); //GetTaskByProjectId
  router.get("/gettaskbyuser/:id", {onRequest: [VerifyToken]}, GetTaskByUser); //GetTaskByUser

  // GetProjectBy.......
  router.get("/getprojectbyuser/:email", {onRequest: [VerifyToken]}, GetProjectByUser); //GetProjectByUser

  next();
};

module.exports = router;
