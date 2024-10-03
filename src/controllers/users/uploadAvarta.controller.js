const path = require("path");
const jwt = require("jsonwebtoken");

const UploadAvarta = async (req, res) => {
  const {authorization} = req.headers;
  const accessToken = authorization.slice(7);
  const decodedToken = jwt.decode(accessToken);
  const {email} = decodedToken;
  console.log("email", email);

  try {
    const file = req.file;
    if (!file) {
      return res.status(400).send({error: "No file uploaded"});
    }

    const filePath = path.join("/avarta", file.filename);
    const formattedPath = filePath.replace(/\\/g, "/");
    const fileAvartaPath = `${process.env.BASE_URL}:${process.env.PORT}/api${formattedPath}`;

    res.send({
      message: "File uploaded successfully",
      fileAvartaPath: fileAvartaPath, // Đường dẫn URL của ảnh
      info: req.file,
    });

    // Luu vao database
    const sqlAddAvartaForUser = `
        UPDATE "users"
        SET avarta = '${fileAvartaPath}'
        WHERE email = '${email}';
      `;
    await QueryDatabase(sqlAddAvartaForUser);
  } catch (error) {
    res.status(500).send({error: error.message});
  }
};

module.exports = UploadAvarta;
