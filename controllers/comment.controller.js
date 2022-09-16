const UserModel = require("../models/user.model");
const CommentModel = require("../models/comment.model");

 
module.exports.comment = (req, res) => {
    if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);

    const newComment = new CommentModel({
        postId: req.params.id,
        commenterId: req.body.commenterId,
        text: req.body.text,
        likers: [],
        reporters:[],
      });
      try {
        newComment.save()
        return res.status(201).json({comment: newComment});
      } catch (err) {
        return res.status(400).send(err);
    }
  };
   
module.exports.editComment = (req, res) => {
    if (!ObjectID.isValid(req.params.id))
      return res.status(400).send("ID unknown : " + req.params.id);
  
    try {
      return CommentModel.findById(req.params.id, (err, docs) => {
        const theComment = docs.comments.find((comment) =>
          comment._id.equals(req.body.commentId)
        );
  
        if (!theComment) return res.status(404).send("Comment not found");
        theComment.text = req.body.text;
  
        return docs.save((err) => {
          if (!err) return res.status(200).send(docs);
          return res.status(500).send(err);
        });
      });
    } catch (err) {
      return res.status(400).send(err);
    }
  };
//get all comments of a post
  module.exports.getPostComments = (req, res) => {
    if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);

    CommentModel.find({postId:req.params.id}, (err, docs) => {
        if (!err) res.status(200).send(docs);
        else console.log("Error to get data : " + err);
      }).sort({ createdAt: -1 });

  };

  module.exports.deleteComment = (req, res) => {
    if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);

  CommentModel.findByIdAndRemove(req.params.id, (err, docs) => {
    if (!err) res.status(200).json({message: "commentaire supprime !"});
    else console.log(" error : " + err);
  });
  };
  

module.exports.likeComment = (req, res) => {
    if (!ObjectID.isValid(req.params.id))
      return res.status(400).send("ID unknown : " + req.params.id);
  
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
          if (!err) res.status(200).send(docs);
          else return res.status(400).send(err);
        }
      );
    } catch (err) {
      return res.status(400).send(err);
    }
  };

  module.exports.unlikeComment =  (req, res) => {
    if (!ObjectID.isValid(req.params.id))
      return res.status(400).send("ID unknown : " + req.params.id);
  
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
    if (!ObjectID.isValid(req.params.id))
      return res.status(400).send("ID unknown : " + req.params.id);
  
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
          if (!err) res.status(200).send(docs);
          else return res.status(400).send(err);
        }
      );
    } catch (err) {
      return res.status(400).send(err);
    }
  };

  module.exports.unReportComment =  (req, res) => {
    if (!ObjectID.isValid(req.params.id))
      return res.status(400).send("ID unknown : " + req.params.id);
  
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
          if (!err) res.status(200).send(docs);
          else return res.status(400).send(err);
        }
      );
    } catch (err) {
      return res.status(400).send(err);
    }
  };
  