const UserModel = require('../models/user.model');
const ObjectID = require('mongoose').Types.ObjectId;
const bcrypt = require('bcrypt');
const path = require('path');
const { hashPassword, validatePassword } = require('../config/bcrypt');

module.exports.getAllUsers = async (req, res, next) => {
  UserModel.find((err, docs) => {
    if (!err) return res.status(200).send(docs);
    else return res.status(400).send('Not found: ' + err);
  }).select('-password');
};

module.exports.userInfos = (req, res) => {
  if (!ObjectID.isValid(req.params.id)) {
    return res.status(400).send('ID unknown : ' + req.params.id);
  }

  UserModel.findById(req.params.id, (err, docs) => {
    if (!err) res.status(200).send(docs);
    else return res.status(400).send('ID UNKNOWN : ' + err);
  }).select('-password');
};

module.exports.updateUser = async (req, res) => {
  if (!ObjectID.isValid(req.params.id)) {
    return res.status(400).send('ID unknown : ' + req.params.id);
  }
  try {
    const user = await UserModel.findById(req.params.id);
    UserModel.findOneAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          first_name: (req.body.first_name = req.body.first_name ? req.body.first_name : user.first_name),
          last_name: (req.body.last_name = req.body.last_name ? req.body.last_name : user.last_name),
          user_name: (req.body.user_name = req.body.user_name ? req.body.user_name : user.user_name),
          address: (req.body.address = req.body.address ? req.body.address : user.address),
          password: (req.body.password = req.body.password ? await hashPassword(req.body.password) : user.password),
          email: (req.body.email = req.body.email ? req.body.email : user.email),
        },
      },
      { new: true, upsert: true, setDefaultsOnInsert: true },
      (err, docs) => {
        if (!err) {
          delete docs.password;
          res.cookie('jwt', '', { maxAge: 1 });
          return res.status(200).send(docs);
        } else return res.status(500).send('message:' + err);
      }
    );
  } catch (err) {
    return res.status(500).send('message:' + err);
  }
};

module.exports.deleteUser = async (req, res) => {
  if (!ObjectID.isValid(req.params.id)) {
    return res.status(400).send('ID unknown :', req.params.id);
  }
  try {
    UserModel.deleteOne({ _id: req.params.id });
    return res.status(200).send('message:Successfully deleted !');
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};

// for a single file upload -- profile

module.exports.uploadProfile = (req, res) => {
  const file = req.file;

  const fs = require('fs');
  const { promisify } = require('util');
  const unlinkAsync = promisify(fs.unlink);

  try {
    UserModel.findById(req.params.idUser, (err, docs) => {
      // delete from the diskStorage
      if (docs.picture.localeCompare('blank-profile-picture.webp') != 0) {
        unlinkAsync(path.resolve('./') + '/uploads/profiles/' + docs.picture);
      }
    });
  } catch (error) {
    return res.status(500).send('message:' + err);
  }

  if (file) {
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
    console.log('No file was added !');
    throw new NoFileSelectedError('An image must be selected !');
  }
};

module.exports.getFile = (req, res) => {
  const filePath = path.resolve('./') + '/uploads/profiles/' + req.params.filePath;

  if (filePath) {
    res.sendFile(filePath);
  } else {
    throw new Error('Failed to get the file');
  }
};
