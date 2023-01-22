const fs = require('fs');
const { promisify } = require('util');
const pipeline = promisify(require('stream').pipeline);
const { uploadErrors } = require('../utils/errors.utils');
// const fileService = require('../services/file.service');

module.exports.uploadProfil = async (req, res) => {
  try {
    // console.log(req.file);
    if (req.file.mimeType != 'image/jpg' && req.file.mimeType != 'image/png' && req.file.mimeType != 'image/jpeg')
      throw Error('invalid file');

    if (req.file.size > 700000) throw Error('max size');
    const fileName = req.body.name + '.jpg';
    await pipeline(req.file.stream, fs.createWriteStream(`${__dirname}/../client/public/uploads/profil/${fileName}`));
    // await fileService.uploadFileToFirebase(fileName, req.file);
  } catch (err) {
    const errors = uploadErrors(err);
    return res.status(403).send(errors);
  }
};
