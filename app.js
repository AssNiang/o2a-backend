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

// firebaseConfiguration
// const imageRoute = require('./routes/image.route');
// import our current configuration
// const config = require('./config');

// routes (for uploading images to storage)
// app.use('/api', imageRoute.routes);

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

//***************************************************************** */
//***************************************************************/
const multer = require('multer');
const PostModel = require('./models/post.model');
const UserModel = require('./models/user.model');
const ObjectID = require('mongoose').Types.ObjectId;
const fileService = require('./services/file.service');

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

app.post('/api/user/file/:idUser', upload_profile.single('file'), (req, res) => {
  const file = req.file;

  const fs = require('fs');
  const { promisify } = require('util');
  const unlinkAsync = promisify(fs.unlink);

  try {
    UserModel.findById(req.params.idUser, (err, docs) => {
      // delete from the diskStorage
      if (docs.picture.localeCompare('blank-profile-picture.webp') != 0) {
        unlinkAsync(__dirname + '/uploads/profiles/' + docs.picture);
        //console.log(docs.picture);
      }
    });
  } catch (error) {
    return res.status(500).send('message:' + err);
  }

  if (file) {
    fileService.uploadFileToFirebase(file);
    res.json(file);

    if (!ObjectID.isValid(req.params.idUser)) return res.status(400).send('ID unknown : ' + req.params.idUser);
    try {
      UserModel.findByIdAndUpdate(
        req.params.idUser,
        {
          $set: {
            picture: req.file.filename,
          },
        },
        { new: true, upsert: true, setDefaultsOnInsert: true },
        (err, docs) => {
          if (!err) {
            return res.status(200);
          } else {
            return res.status(400).send({ message: 'Update Error : ' + err });
          }
        }
      );
    } catch (err) {
      return res.status(500).send('message:' + err);
    }
  } else {
    //console.log('No file was added !');
    throw new NoFileSelectedError('An image must be selected !');
  }
});
app.get('/api/user/file/:filePath', (req, res) => {
  const filePath = __dirname + '/uploads/profiles/' + req.params.filePath;

  if (filePath) {
    res.sendFile(filePath);
  } else {
    throw new Error('Failed to get the file');
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

app.post('/api/post/file/:idPost', upload_post_image.single('file'), (req, res) => {
  const file = req.file;

  const fs = require('fs');
  const { promisify } = require('util');
  const unlinkAsync = promisify(fs.unlink);

  const allowedImageMimeTypes = ['image/png', 'image/jpeg', 'image/jpg'];
  const allowedVideoMimeTypes = ['video/mp4'];
  const allowedAudioMimeTypes = ['audio/mpeg', 'audio/wav', 'audio/wave'];

  if (file) {
    fileService.uploadFileToFirebase(file);
    res.json(file);

    if (!ObjectID.isValid(req.params.idPost)) return res.status(400).send('ID unknown : ' + req.params.idPost);
    try {
      PostModel.findById(req.params.idPost, (err, docs) => {
        // delete from the diskStorage
        // console.log(docs);
        // console.log(file.mimetype);
        if (docs.picture) {
          unlinkAsync(__dirname + '/uploads/posts/' + docs.picture);
        } else if (docs.video) {
          unlinkAsync(__dirname + '/uploads/posts/' + docs.video);
        } else if (docs.audio) {
          unlinkAsync(__dirname + '/uploads/posts/' + docs.audio);
        }
      });

      if (allowedImageMimeTypes.includes(file.mimetype)) {
        PostModel.findByIdAndUpdate(
          req.params.idPost,
          {
            $set: {
              picture: req.file.filename,
              video: '',
              audio: '',
            },
          },
          { new: true, upsert: true, setDefaultsOnInsert: true },
          (err, docs) => {
            if (!err) {
              return res.status(200);
            } else {
              return res.status(400).send({ message: 'Update Error : ' + err });
            }
          }
        );
      } else if (allowedVideoMimeTypes.includes(file.mimetype)) {
        PostModel.findByIdAndUpdate(
          req.params.idPost,
          {
            $set: {
              video: req.file.filename,
              picture: '',
              audio: '',
            },
          },
          { new: true, upsert: true, setDefaultsOnInsert: true },
          (err, docs) => {
            if (!err) {
              return res.status(200);
            } else {
              return res.status(400).send({ message: 'Update Error : ' + err });
            }
          }
        );
      } else if (allowedAudioMimeTypes.includes(file.mimetype)) {
        PostModel.findByIdAndUpdate(
          req.params.idPost,
          {
            $set: {
              audio: req.file.filename,
              picture: '',
              video: '',
            },
          },
          { new: true, upsert: true, setDefaultsOnInsert: true },
          (err, docs) => {
            if (!err) {
              return res.status(200);
            } else {
              return res.status(400).send({ message: 'Update Error : ' + err });
            }
          }
        );
      }
    } catch (err) {
      return res.status(500).send('message:' + err);
    }
  } else {
    //console.log('No file was added !');

    try {
      PostModel.findByIdAndUpdate(
        req.params.idPost,
        {
          $set: {
            picture: '',
            video: '',
            audio: '',
          },
        },
        { new: true, upsert: true, setDefaultsOnInsert: true },
        (err, docs) => {
          if (!err) {
            return res.status(200);
          } else {
            return res.status(400).send({ message: 'Update Error : ' + err });
          }
        }
      );
    } catch (err) {
      return res.status(500).send('message:' + err);
    }
  }
  //console.log(file)
});

// for multiple files upload
app.post('/api/post/multifiles', upload_post_image.array('files'), (req, res) => {
  const files = req.files;

  if (Array.isArray(files) && files.length > 0) {
    res.json(files);
    // some test
    files.forEach((file) => {
      console.log(file.filename);
    });
    //end some test
  } else {
    throw new Error('Files upload unsuccessful');
  }
});

app.get('/api/post/file/:filePath', (req, res) => {
  const filePath = __dirname + '/uploads/posts/' + req.params.filePath;

  if (filePath) {
    res.sendFile(filePath);
  } else {
    throw new Error('Failed to get the file');
  }
});

//*****************************************************************************/

const server = app.listen(process.env.PORT || 3000, () => {
  console.log(`Listening on port ${process.env.PORT}`);
});

module.exports = { server };
