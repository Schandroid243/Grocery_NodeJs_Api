const multer = require("multer");
const Path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/categories");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, callback) => {
  const acceptableExt = [".png", ".jpg", ".jpeg"];
  if (!acceptableExt.includes(Path.extname(file.originalname))) {
    return callback(
      new Error("Invalid file. Only .png, .jpeg and .jpg files are allowed !")
    );
  }
  const fileSize = parseInt(req.headers["Content-Length"]);
  if (fileSize > 1048576) {
    return callback(new Error("Only file below 2 mb are allowed !"));
  }
  callback(null, true);
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  fileSize: 1048576,
});

module.exports = upload.single("categoryImage");
