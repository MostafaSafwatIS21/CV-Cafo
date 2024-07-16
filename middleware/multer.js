const multer = require("multer");
const storage = multer.diskStorage({
  filename: function(req, file, cb) {
    const ext = file.mimetype.split("/")[1];
    cb(null, `user-${Date.now()}.${ext}`);
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
