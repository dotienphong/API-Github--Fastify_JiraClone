const escape = require("escape-html");
const jwt = require("jsonwebtoken");
const {GenerateAccessToken, GenerateRefreshToken} = require("../../utils/generateJWT");
const QueryDatabase = require("../../utils/queryDatabase");
const {compareHashPassword, hashPassword} = require("../../utils/hashBcrypt");
const logger = require("../../loggers/loggers.config");
const admin = require("../../connection/firebase/firebase.connection");

const Login = async (req, res) => {
  try {
    const sql = `
      SELECT * FROM "users";
    `;
    const data = await QueryDatabase(sql);

    const email = escape(req.body.email);
    const password = escape(req.body.password);

    const findAccount = data.rows.find((item) => item.email === email);

    // Check email
    if (!findAccount) {
      res.status(404);
      return {code: 404, message: "Email not found"};
    }

    // Compare Password with database
    const checkPassword = await compareHashPassword(password, findAccount.password);
    if (checkPassword === false) {
      res.status(401);
      return {code: 401, message: "Password is wrong"};
    }

    if (checkPassword === true) {
      const sql_search_role = `SELECT role FROM "users" WHERE email = '${email}'`;
      const role = await QueryDatabase(sql_search_role);

      const accessToken = GenerateAccessToken({name: findAccount?.name, email: email, role: role.rows[0].role});
      const refreshToken = GenerateRefreshToken({name: findAccount?.name, email: email, role: role.rows[0].role});
      return {
        access_token: accessToken,
        refresh_token: refreshToken,
      };
    }
  } catch (error) {
    logger.error(error);
    console.error("Internal Server Error 🔥:: ", err);
    res.status(500);
    return {code: 500, message: "Internal Server Error"};
  }
};

const RefreshToken = async (req, res) => {
  try {
    const authHeaders = req.headers["authorization"];

    if (!authHeaders) {
      res.status(401);
      return {code: 401, message: "Can not find authorization header"};
    }

    const checkBearer = authHeaders.includes("Bearer");
    if (!checkBearer) {
      res.status(401);
      return {code: 401, message: "Do not have Bearer"};
    }

    const token = authHeaders.replace("Bearer ", "");
    if (!token) {
      res.status(401);
      return {code: 401, message: "Unauthorized"};
    }

    const checkVerify = jwt.verify(token, process.env.REFRESH_TOKEN);

    const accessToken = GenerateAccessToken({name: checkVerify.name, email: checkVerify.email, role: checkVerify.role});
    const refreshToken = GenerateRefreshToken({name: checkVerify?.name, email: checkVerify?.email, role: checkVerify.role});
    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  } catch (error) {
    logger.error(error);
    res.status(401);
    return {code: 401, message: "Unauthorized"};
  }
};

const SignUp = async (req, res) => {
  try {
    if (!req.body) {
      res.status(400).send({status: 400, message: "Missing req.body data"});
    }

    const {name, email, password} = req.body;

    const escapedEmail = escape(email);
    const escapedName = escape(name);
    const escapedPassword = escape(password);

    // Check email, user Not Null
    if (!name || !email || !password) {
      res.status(400);
      return {code: 400, message: "Missing required fields"};
    }

    // Check if the email already exists
    const checkEmailSql = `SELECT * FROM "users" WHERE email = '${escapedEmail}'`;
    const existingUser = await QueryDatabase(checkEmailSql);
    if (existingUser.rows.length > 0) {
      res.status(409); // Conflict status code
      return {code: 409, message: "Email already exists"};
    }

    const hashedPassword = await hashPassword(escapedPassword);

    const insertUserSql = `
      INSERT INTO "users" (name, email, password, role)
      VALUES ('${escapedName}', '${escapedEmail}', '${hashedPassword}', '${0}')
    `;
    await QueryDatabase(insertUserSql);

    return {code: 201, message: "Created account successfully"};
  } catch (error) {
    logger.error(error);
    console.error("Internal Server Error 🔥:: ", error);
    res.status(500); // Internal Server Error
    return {code: 500, message: "Internal Server Error"};
  }
};

const LoginFirebase = async (req, res) => {
  if (!req.body) {
    res.status(400).send({status: 400, message: "Missing req.body data"});
  }
  const {token} = req.body; // Nhận firebase_token từ client

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);

    const checkEmail = `SELECT * FROM "users" WHERE email = '${decodedToken.email}'`;
    const emailExist = await QueryDatabase(checkEmail);

    const findAccount = emailExist.rows.find((item) => item.email === decodedToken.email);
    if (!findAccount) {
      try {
        const sqlCreateNewUser = `
          INSERT INTO "users" (name, email, password , role) 
          VALUES ('${decodedToken.name}', '${decodedToken.email}', '','${0}');
        `;
        await QueryDatabase(sqlCreateNewUser);
      } catch (error) {
        logger.error(error);
        res.status(500).send({code: 500, message: "Create user by Google-Login fail"});
      }
      const checkEmailExistAfterCreateByGoogle = await QueryDatabase(checkEmail);
      const {name, email, role} = checkEmailExistAfterCreateByGoogle.rows[0];

      const access_token = GenerateAccessToken({name: name, email: email, role: role});
      const refresh_Token = GenerateRefreshToken({name: name, email: email, role: role});
      res.status(200).send({
        access_token: access_token,
        refresh_Token: refresh_Token,
      });
    } else {
      const {name, email, role} = emailExist.rows[0];
      const access_token = GenerateAccessToken({name: name, email: email, role: role});
      const refresh_Token = GenerateRefreshToken({name: name, email: email, role: role});

      res.status(200).send({
        access_token: access_token,
        refresh_Token: refresh_Token,
      });
    }
  } catch (error) {
    console.error("Unauthorized with Google account", error);
    logger.error(error);
    res.status(401);
    return {code: 401, message: "Unauthorized with Google account"};
  }
};

module.exports = {
  Login,
  RefreshToken,
  SignUp,
  LoginFirebase,
};
