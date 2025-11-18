// /middleware/multer.js
const multer = require('multer');

const storage = multer.memoryStorage(); // keep file in RAM
const upload = multer({ storage });

module.exports = upload;
