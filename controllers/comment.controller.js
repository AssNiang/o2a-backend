const UserModel = require("../models/user.model");
const CommentModel = require("../models/comment.model");
const ObjectID = require("mongoose").Types.ObjectId;


 
module.exports.comment = (req, res) => {
    if (!ObjectID.isValid(req.params.id)){
        return res.status(400).send("ID unknown : " + req.params.id);
      }

    const newComment = new CommentModel({
        postId: req.params.id,
        commenterId: req.body.commenterId,
        text: req.body.text,
        likers: [],
        reporters:[],
      });
      try {
        newComment.save()
        return res.status(201).send("comment:"+ newComment);
      } catch (err) {
        return res.status(400).send(err);
      }
};
   
module.exports.editComment = (req, res) => {
  if (!ObjectID.isValid(req.params.id)){
      return res.status(400).send("ID unknown : " + req.params.id);
  }
  CommentModel.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        text: req.body.text,
      },
    },
    { new: true, upsert: true, setDefaultsOnInsert: true },
    (err, docs) => {
      if (!err) return res.status(200).send(docs);
      return res.status(400).send("Update Error: "+err);
    },
  );
};

//get all comments of a post
  module.exports.getPostComments = (req, res) => {
    if (!ObjectID.isValid(req.params.id)) {
      return res.status(400).send("ID unknown : " + req.params.id);
  }

    CommentModel.find({postId:req.params.id}, (err, docs) => {
        if (!err) return res.status(200).send(docs);
        else return res.status(400).send("Error to get data: "+err);
      }).sort({ createdAt: -1 });

  };

  module.exports.deleteComment = (req, res) => {
    if (!ObjectID.isValid(req.params.id)){
      return res.status(400).send("ID unknown : " + req.params.id);
   }
    CommentModel.findByIdAndRemove(req.params.id, (err, docs) => {
      if (!err) return res.status(200).json({message: "commentaire supprime !"});
      else return res.status(400).send("Error : " + err);
    });
  };
  

module.exports.likeComment = (req, res) => {
    if (!ObjectID.isValid(req.params.id)){
      return res.status(400).send("ID unknown : " + req.params.id);
    }
  
    try {
      CommentModel.findByIdAndUpdate(
        req.params.id,
        {
          $addToSet: {likers: req.body.id },
        },
        { new: true },
        (err, docs) => {
          if (err) return res.status(400).send(err);
        }
      );
  
       UserModel.findByIdAndUpdate(
        req.body.id,
        {
          $addToSet: { commentLikes: req.params.id },
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

  module.exports.unlikeComment =  (req, res) => {
    if (!ObjectID.isValid(req.params.id)){
      return res.status(400).send("ID unknown : " + req.params.id);
    }
  
    try {
      CommentModel.findByIdAndUpdate(
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
          $pull: { commentLikes: req.params.id },
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

  module.exports.reportComment =  (req, res) => {
    if (!ObjectID.isValid(req.params.id)){
      return res.status(400).send("ID unknown : " + req.params.id);
    }
  
    try {
       CommentModel.findByIdAndUpdate(
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
          $addToSet: { commentReports: req.params.id },
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

  module.exports.unReportComment =  (req, res) => {
    if (!ObjectID.isValid(req.params.id)){
      return res.status(400).send("ID unknown : " + req.params.id);
    }
  
    try {
      CommentModel.findByIdAndUpdate(
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
          $pull: { reports: req.params.id },
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
  