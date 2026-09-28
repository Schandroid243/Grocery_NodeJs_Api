const multer = require("multer");
const Path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/sliders");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, callback) => {
  const fileExt = [".png", ".jpg", ".jpeg"];
  if (!fileExt.includes(Path.extname(file.originalname))) {
    return callback(new Error("Invalid file extension"));
  }

  const fileSize = parseInt(req.headers["Content-Length"]);
  if (fileSize > 1048576) {
    return callback(new Error("Invalid file size"));
  }

  callback(null, true);
};

let upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  fileSize: 1048576,
});

module.exports = upload.single("sliderImage");
