const multer = require('multer');

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, 'uploads/avatars/');
    },
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // max 5MB for image size
});

module.exports = upload;