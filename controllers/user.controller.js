const UserModel = require('../models/user.model');
const ObjectID = require('mongoose').Types.ObjectId;

module.exports.getAllUsers = async (req, res, next) => {
    UserModel.find((err, docs) => {
      if (!err) return res.status(200).send(docs);
      else  return res.status(400).send("Not found: " + err);
    }).select("-password");
};

module.exports.userInfos = (req, res) => {
  if (!ObjectID.isValid(req.params.id)) {
    return res.status(400).send("ID unknown : " + req.params.id);
  }
  
  UserModel.findById(req.params.id, (err, docs) => {
    if (!err) res.status(200).send(docs);
    else return res.status(400).send("ID UNKNOWN : " + err);
  }).select("-password");
};

module.exports.updateUser = (req, res) => {
  if (!ObjectID.isValid(req.params.id)){
    return res.status(400).send("ID unknown : " + req.params.id);
  }try{
    UserModel.findOneAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          first_name: req.body.first_name,
          last_name: req.body.last_name,
          address: req.body.address,
          date_of_birth: req.body.date_of_birth,
          sexe: req.body.sexe,
          is_admin: req.body.is_admin,
          is_patient: req.body.is_patient,
          is_specialist: req.body.is_specialist
        },
      },
      { new: true, upsert: true, setDefaultsOnInsert: true },
      (err, docs) => {
        if (!err) return res.status(200).send(docs);
        else return res.status(500).send("message:" +  err );
      });
    } catch (err) {
      return res.status(500).send("message:"+ err );
    }
  };

module.exports.deleteUser = async (req, res)=>{
  if (!ObjectID.isValid(req.params.id)){
      return res.status(400).send('ID unknown :', req.params.id);
  } try {
    UserModel.deleteOne({_id:req.params.id});
    return res.status(200).send("message:Successfully deleted !");
  }catch(err){
    return res.status(500).json({message: err});
  }
};

