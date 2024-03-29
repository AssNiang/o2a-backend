const multer = require('multer');

const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    const mimeType = file.mimetype.split('/');
    const fileType = mimeType[1];
    const filename = file.originalname + '.' + fileType;
    cb(null, filename);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['image/png', 'image/jpeg', 'image/jpg'];
  allowedMimeTypes.includes(file.mimeType) ? cb(null, true) : cb(null, false);
};

const storage = multer({ storage: diskStorage, fileFilter: fileFilter }).single('image');

module.exports = storage;
