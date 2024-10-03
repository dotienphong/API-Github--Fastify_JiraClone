const path = require("path");
const jwt = require("jsonwebtoken");
const QueryDatabase = require("../../utils/queryDatabase");

const UploadAvarta = async (req, res) => {
  const {authorization} = req.headers;
  const accessToken = authorization.slice(7);
  const decodedToken = jwt.decode(accessToken);
  const {email} = decodedToken;

  try {
    const file = req.file;
    if (!file) {
      return res.status(400).send({status: 400, message: "No file uploaded"});
    }

    const filePath = path.join("/avarta", file.filename);
    const formattedPath = filePath.replace(/\\/g, "/");
    const URL_LINK_AVARTA = process.env.NODE_ENV === "production" ? process.env.BASE_URL : process.env.BASE_URL_LOCAL;
    const fileAvartaPath = `${URL_LINK_AVARTA}:${process.env.PORT}/api${formattedPath}`;

    // Luu vao database
    const sqlAddAvartaForUser = `
      UPDATE "users"
      SET avarta = '${fileAvartaPath}'
      WHERE email = '${email}';
      `;
    await QueryDatabase(sqlAddAvartaForUser);

    res.send({
      message: "File uploaded successfully",
      fileAvartaPath: fileAvartaPath, // Đường dẫn URL của ảnh
      info: req.file,
    });
  } catch (error) {
    res.status(500).send({error: error.message});
  }
};

module.exports = UploadAvarta;
