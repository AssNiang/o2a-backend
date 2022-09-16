const ObjectID = require("mongoose").Types.ObjectId;
const UserModel = require('../models/user.model');
const FileModel = require('../models/fiche.model');
const PostModel = require('../models/post.model');
const SpecialistModel = require('../models/specialist.model');


module.exports.createSpecialist = async (req, res) => {
  const {userId, professionnal_address, job, workplace} = req.body;
  const matricule = "O2A_specialist" + Date.now() + "o2a"; 
  if (!ObjectID.isValid(userId)){
    return res.status(400).send("L'utilisateur d'id " + userId +" n'existe pas: " );
  } try {
      const specialist = new SpecialistModel({
        userId:userId, 
        matricule:matricule, 
        professionnal_address:professionnal_address, 
        workplace:workplace, 
        job:job
      });
       UserModel.findByIdAndUpdate(
        userId,
        {
          $set: {
            is_specialist: true
          },
        },
        { new: true, upsert: true, setDefaultsOnInsert: true },
        (err, docs) => {  
          if (err) return res.status(500).send({ message: err }); 
        }
        ); 
      specialist.save()
      .then(() => {  return res.status(201).json({id: req.body.userId});})
      .catch(err => res.status(500).send({ message: err }));
     
  }
  catch(err){
      res.status(400).send({err});
  }
} ;

module.exports.getReportedPosts = (req, res) => {
    PostModel.find({reporters:{$size:1}}, (err, docs) => {
        if (!err) return res.status(200).send(docs);
        else console.log("Error to get data : " + err);
      });
    
};

module.exports.getRetiredAccounts = async (req, res, next) => {
  UserModel.find({is_locked:true}, (err, docs) => {
    if (!err) res.status(200).send(docs);
    else console.log("Error to get data : " + err);
  });
  next();
};

module.exports.getAllAccounts = async (req, res, next) => {
  const users = await UserModel.find().select('-password');
  res.status(200).json({users});
  next();
};

module.exports.getNoRetiredAccounts = async (req, res, next) => {
  UserModel.find({is_locked:false}, (err, docs) => {
    if (!err) return res.status(200).send(docs);
    else console.log("Error to get data : " + err);
  });
  next();
};

module.exports.getPatients = async (req, res, next) => {
  UserModel.find({is_patient:true}, (err, docs) => {
    if (!err) return res.status(200).send(docs);
    else console.log("Error to get data : " + err);
  });
  next();
};

module.exports.getFollowedPatients = async (req, res) => {
  UserModel.find({is_patient:true, followers:{$size:1}}, (err, docs) => {
    if (!err) return res.status(200).send(docs);
    else console.log("Error to get data : " + err);
  }); 
};

module.exports.getUnFollowedPatients = async (req, res) => {
  UserModel.find({is_patient:true, followers:{$size:0}}, (err, docs) => {
    if (!err) return res.status(200).send(docs);
    else console.log("Error to get data : " + err);
  });
};
