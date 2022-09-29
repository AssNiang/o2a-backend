const express = require('express');
const userRoutes = require('./routes/user.routes');
const postRoutes = require('./routes/post.routes');
const commentRoutes = require('./routes/comment.routes');
const specialistRoutes = require('./routes/specialist.routes');
const adminRoutes = require('./routes/admin.routes');
const cookieParser = require('cookie-parser');
const databaseHelper = require('./config/database');
const cors = require('cors');
require('dotenv').config({ path: './config/.env' });
require('./config/db');
const { checkUser, requiredAuth } = require('./middleware/auth.middleware');

const app = express();
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(cors());
app.use(cookieParser());

const corsOptions = {
  origin: process.env.CLIENT_URL,
  credentials: true,
  allowedHeaders: ['sessionId', 'Content-Type'],
  exposedHeaders: ['sessionId'],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
};
app.use(cors(corsOptions));
//database
databaseHelper.connect();

// jwt
app.get('*', checkUser);
app.get('/jwtid', requiredAuth, (req, res) => {
  res.status(200).send(res.locals.user._id);
});

//routes
app.use('/api/user', userRoutes);
app.use('/api/post', postRoutes);
app.use('/api/comment', commentRoutes);
app.use('/api/user/specialist', specialistRoutes);
app.use('/api/user/admin', adminRoutes);

//***************************************************************/
const multer = require('multer');

const storage_profile = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/profiles');
  },
  filename: (req, file, cb) => {
    cb(null, `profile.${Date.now()}_${file.originalname}`);
  },
});

const upload_profile = multer({ storage: storage_profile });

// for a single file upload -- profile

app.post('/api/user/file', upload_profile.single('file'), (req, res) => {
  const file = req.file;

  if (file) {
    res.json(file);
  } else {
    throw new Error('Failed to upload the file');
  }
});
app.get('/api/user/file/:filePath', (req, res) => {
  const filePath = __dirname + '/uploads/profiles/' + req.params.filePath;

  if (filePath) {
    res.sendFile(filePath);
  } else {
    throw new Error('Failed to upload the file');
  }
});

// for a single file upload -- post -------------------------------------------------
const storage_post_image = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/posts');
  },
  filename: (req, file, cb) => {
    cb(null, `post.${Date.now()}_${file.originalname}`);
  },
});

const upload_post_image = multer({ storage: storage_post_image });

app.post('/api/post/file', upload_post_image.single('file'), (req, res) => {
  const file = req.file;

  if (file) {
    res.json(file);
  } else {
    throw new Error('Failed to upload the file');
  }
});

// for multiple files upload
app.post('/api/post/multifiles', upload_post_image.array('files'), (req, res) => {
  const files = req.files;

  if (Array.isArray(files) && files.length > 0) {
    res.json(files);
  } else {
    throw new Error('Files upload unsuccessful');
  }
});

//*****************************************************************************/

const server = app.listen(process.env.PORT || 3000, () => {
  console.log(`Listening on port ${process.env.PORT}`);
});

module.exports = { server };
