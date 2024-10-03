const path = require("path");

const UploadAvarta = async (req, reply) => {
  try {
    const file = req.file;
    if (!file) {
      return reply.status(400).send({error: "No file uploaded"});
    }

    const filePath = path.join("/avarta", file.filename);
    const formattedPath = filePath.replace(/\\/g, "/");

    reply.send({
      message: "File uploaded successfully",
      fileAvartaPath: `${process.env.BASE_URL}/api${formattedPath}`, // Đường dẫn URL của ảnh
      info: req.file,
    });
  } catch (error) {
    reply.status(500).send({error: error.message});
  }
};

module.exports = UploadAvarta;
