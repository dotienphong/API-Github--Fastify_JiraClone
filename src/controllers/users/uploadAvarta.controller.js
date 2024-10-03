const path = require("path");

const UploadAvarta = async (req, reply) => {
  try {
    const file = req.file;
    if (!file) {
      return reply.status(400).send({error: "No file uploaded"});
    }

    const filePath = path.join("/uploads", file.filename);
    const formattedPath = filePath.replace(/\\/g, "/");
    console.log(formattedPath);

    reply.send({
      message: "File uploaded successfully",
      filePath: `http://localhost:4001/api${formattedPath}`, // Đường dẫn URL của ảnh
    });
  } catch (error) {
    reply.status(500).send({error: error.message});
  }
};

module.exports = UploadAvarta;
