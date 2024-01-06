//first we need To modules @path and @multer
const path = require("path");
const multer = require("multer");

//Photo Storage
const photoStorage = multer.diskStorage({
  //first pramter
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../images"));
  },
  filename: function (req, file, cb) {
    if (file) {
      cb(null, new Date().toISOString().replace(/:/, "-") + file.originalname);
    } else {
      cb(null, false);
    }
  },
});
//Photo Upload Middlware

const photoUpload = multer({
  storage: photoStorage,
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb({ message: "Unsupported file format" }, false);
    }
  },
  limits: { fileSize: 1024 * 1024 }, //meanning one migaByte
});
module.exports = photoUpload