const PostModel = require('../models/post.model');
const CommentModel = require('../models/comment.model');
const FicheModel = require('../models/fiche.model');
const UserModel = require('../models/user.model');
const { uploadErrors } = require('../utils/errors.utils');
const ObjectID = require('mongoose').Types.ObjectId;
const fs = require('fs');
const { promisify } = require('util');
const commentModel = require('../models/comment.model');
const pipeline = promisify(require('stream').pipeline);

module.exports.readPost = (req, res) => {
  PostModel.find((err, docs) => {
    if (!err) res.status(200).send(docs);
    else console.log('Error to get data : ' + err);
  }).sort({ createdAt: -1 });
};

module.exports.getPostById = (req, res) => {
  PostModel.findById(req.params.id, (err, doc) => {
    if (!err) res.status(200).send(doc);
    else console.log('Error to get data : ' + err);
  });
};
//all user's posts
module.exports.getUserPosts = (req, res) => {
  if (!ObjectID.isValid(req.params.id)) return res.status(400).send('ID unknown : ' + req.params.id);

  PostModel.find({ posterId: req.params.id }, (err, docs) => {
    if (!err) res.status(200).send(docs);
    else console.log('Error to get data : ' + err);
  }).sort({ createdAt: -1 });
};

module.exports.createPublicPost = async (req, res) => {
  // let fileName;

  // if (req.file !== null) {
  //   try {
  //     if (
  //       req.file.detectedMimeType != "image/jpg" &&
  //       req.file.detectedMimeType != "image/png" &&
  //       req.file.detectedMimeType != "image/jpeg"
  //     )
  //       throw Error("invalid file");

  //     if (req.file.size > 500000) throw Error("max size");
  //   } catch (err) {
  //     const errors = uploadErrors(err);
  //     return res.status(201).json({ errors });
  //   }
  //   fileName = req.body.posterId + Date.now() + ".jpg";

  //   await pipeline(
  //     req.file.stream,
  //     fs.createWriteStream(
  //       `${__dirname}/../client/public/uploads/posts/${fileName}`
  //     )
  //   );
  // }

  const newPost = new PostModel({
    posterId: req.body.posterId,
    message: req.body.message,
    // picture: req.file !== null ? "./uploads/posts/" + fileName : "",
    video: req.body.video,
    audio: req.body.audio,
    likers: [],
    reporters: [],
  });

  try {
    newPost.save();
    return res.status(201).send(newPost);
  } catch (err) {
    return res.status(400).send(err);
  }
};

module.exports.createPrivatePost = async (req, res) => {
  // let fileName;

  // if (req.file !== null) {
  //   try {
  //     if (
  //       req.file.detectedMimeType != "image/jpg" &&
  //       req.file.detectedMimeType != "image/png" &&
  //       req.file.detectedMimeType != "image/jpeg"
  //     )
  //       throw Error("invalid file");

  //     if (req.file.size > 500000) throw Error("max size");
  //   } catch (err) {
  //     const errors = uploadErrors(err);
  //     return res.status(201).json({ errors });
  //   }
  //   fileName = req.body.posterId + Date.now() + ".jpg";

  //   await pipeline(
  //     req.file.stream,
  //     fs.createWriteStream(
  //       `${__dirname}/../client/public/uploads/posts/${fileName}`
  //     )
  //   );
  // }

  const newPost = new PostModel({
    posterId: req.body.posterId,
    message: req.body.message,
    statut: 'private',
    // picture: req.file !== null ? "./uploads/posts/" + fileName : "",
    video: req.body.video,
    audio: req.body.audio,
    likers: [],
    reporters: [],
  });
  try {
    newPost.save();
    const newFiche = new FicheModel({
      postId: newPost._id,
      patientId: req.body.posterId,
    });
    newFiche.save();
    return res.status(201).json(newPost);
  } catch (err) {
    return res.status(400).send(err);
  }
};

module.exports.updatePost = (req, res) => {
  if (!ObjectID.isValid(req.params.id)) return res.status(400).send('ID unknown : ' + req.params.id);
  try {
    PostModel.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          posterId: req.body.posterId,
          message: req.body.message,
          statut: req.body.statut,
        },
      },
      { new: true, upsert: true, setDefaultsOnInsert: true },
      (err, docs) => {
        if (!err) return res.status(200).send(docs);
        else return res.status(400).send({ message: 'Update Error : ' + err });
      }
    );
  } catch (err) {
    return res.status(500).send('message:' + err);
  }
};

module.exports.deletePost = (req, res) => {
  if (!ObjectID.isValid(req.params.id)) return res.status(400).send({ message: 'ID unknown : ' + req.params.id });

  const fs = require('fs');
  const { promisify } = require('util');
  const unlinkAsync = promisify(fs.unlink);

  // CommentModel.find({ postId: req.params.id }, (err, docs) => {
  //   if(docs.length){
  //     CommentModel.find({ postId: req.params.id }).deleteMany();
  //   }
  // });

  //await CommentModel.deleteMany({ postId: req.params.id });

  PostModel.findByIdAndRemove({ _id: req.params.id }, (err, docs) => {
    // delete from the diskStorage
    if (docs.picture) {
      unlinkAsync(__dirname + '/../uploads/posts/' + docs.picture);
    }
    if (docs.video) {
      unlinkAsync(__dirname + '/../uploads/posts/' + docs.video);
    }
    if (docs.audio) {
      unlinkAsync(__dirname + '/../uploads/posts/' + docs.audio);
    }

    commentModel.find({ postId: req.params.id }).deleteMany().exec();

    if (!err) return res.status(200).send({ message: 'Post supprime !' });
    else return res.status(400).send(err);
  });
};

module.exports.likePost = (req, res) => {
  if (!ObjectID.isValid(req.params.id)) return res.status(400).send('ID unknown : ' + req.params.id);

  try {
    PostModel.findByIdAndUpdate(
      req.params.id,
      {
        $addToSet: { likers: req.body.id },
      },
      { new: true },
      (err, docs) => {
        if (err) return res.status(400).send(err);
      }
    );
    UserModel.findByIdAndUpdate(
      req.body.id,
      {
        $addToSet: { postLikes: req.params.id },
      },
      { new: true },
      (err, docs) => {
        if (!err) return res.status(200).send(docs);
        else return res.status(400).send(err);
      }
    );
  } catch (err) {
    return res.status(400).send(err);
  }
};

module.exports.unlikePost = (req, res) => {
  if (!ObjectID.isValid(req.params.id)) return res.status(400).send('ID unknown : ' + req.params.id);

  try {
    PostModel.findByIdAndUpdate(
      req.params.id,
      {
        $pull: { likers: req.body.id },
      },
      { new: true },
      (err, docs) => {
        if (err) return res.status(400).send(err);
      }
    );
    UserModel.findByIdAndUpdate(
      req.body.id,
      {
        $pull: { postLikes: req.params.id },
      },
      { new: true },
      (err, docs) => {
        if (!err) return res.status(200).send(docs);
        else return res.status(400).send(err);
      }
    );
  } catch (err) {
    return res.status(400).send(err);
  }
};

module.exports.reportPost = (req, res) => {
  if (!ObjectID.isValid(req.params.id)) return res.status(400).send('ID unknown : ' + req.params.id);

  try {
    PostModel.findByIdAndUpdate(
      req.params.id,
      {
        $addToSet: { reporters: req.body.id },
      },
      { new: true },
      (err, docs) => {
        if (err) return res.status(400).send(err);
      }
    );
    UserModel.findByIdAndUpdate(
      req.body.id,
      {
        $addToSet: { postReports: req.params.id },
      },
      { new: true },
      (err, docs) => {
        if (!err) return res.status(200).send(docs);
        else return res.status(400).send(err);
      }
    );
  } catch (err) {
    return res.status(400).send(err);
  }
};

module.exports.unReportPost = (req, res) => {
  if (!ObjectID.isValid(req.params.id)) return res.status(400).send('ID unknown : ' + req.params.id);

  try {
    PostModel.findByIdAndUpdate(
      req.params.id,
      {
        $pull: { reporters: req.body.id },
      },
      { new: true },
      (err, docs) => {
        if (err) return res.status(400).send(err);
      }
    );
    UserModel.findByIdAndUpdate(
      req.body.id,
      {
        $pull: { postReports: req.params.id },
      },
      { new: true },
      (err, docs) => {
        if (!err) res.status(200).send(docs);
        else return res.status(400).send(err);
      }
    );
  } catch (err) {
    return res.status(400).send(err);
  }
};
