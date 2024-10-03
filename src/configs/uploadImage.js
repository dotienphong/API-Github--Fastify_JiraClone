const multer = require("fastify-multer");
const fs = require("fs");
const path = require("path");

const uploadDir = path.resolve("./uploads");

// Cấu hình multer để lưu ảnh upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Tạo thư mục nếu chưa tồn tại
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, {recursive: true});
    }
    cb(null, uploadDir); // Lưu vào thư mục upload
  },
  filename: (req, file, cb) => {
    // Đặt tên file bao gồm thời gian upload để tránh trùng lặp
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // Giới hạn kích thước file 10MB
  },
  fileFilter: (req, file, cb) => {
    // Chỉ cho phép upload file ảnh
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Just allow upload image!"), false);
    }
  },
});

module.exports = {upload, uploadDir};
