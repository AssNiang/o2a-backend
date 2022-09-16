 const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema(
  {
    posterId: {
      type: String,
      required: true
    },
    statut: {
        type: String,
        required: true,
        enum: ['public', 'private'],
        default: 'public',
   },
    message: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    picture: {
      type: String,
    },
    video: {
      type: String,
    },
    audio: {
        type: String,
      },
    likers: {
      type: [String],
      required: true,
    },
    reporters: {
        type: [String],
        required: true,
      },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('post', PostSchema);