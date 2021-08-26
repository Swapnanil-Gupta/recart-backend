const multer = require("multer");

const upload = multer({
  dest: "temp-uploads",
});

module.exports = upload;
