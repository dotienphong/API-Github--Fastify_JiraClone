const fs = require("fs");
const path = require("path");
const mime = require("mime-types");

const uploadDir = path.resolve("./uploads");

const GetAvarta = async (req, res) => {
  const {filename} = req.params;
  const filePath = path.join(uploadDir, filename);

  if (fs.existsSync(filePath)) {
    const contentType = mime.lookup(filePath);
    res.header("Content-Type", contentType || "application/octet-stream");
    const stream = fs.createReadStream(filePath);
    stream.on("error", (err) => {
      res.status(500).send({error: "Error reading file"});
    });

    stream.on("close", () => {
      return res;
    });

    return res.send(stream);
  } else {
    return res.status(404).send({error: "File or directory not found"});
  }
};

module.exports = GetAvarta;
