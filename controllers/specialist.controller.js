const SpecialistModel = require('../models/specialist.model');
const UserModel = require('../models/user.model');
const FileModel = require('../models/fiche.model');
const AllergieFileModel = require('../models/allergie.model');
const ObjectID = require("mongoose").Types.ObjectId;


module.exports.getAllPatientsFiles = async (req, res) => {
    FileModel.find((err, docs) => {
        if (!err) return res.status(200).send(docs);
        else return res.status(400).send("Error to get file: "+err);
      });
 };

 module.exports.getPatientFile = async (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send("ID unknown : " + req.params.id);
    try {
        FileModel.find({patientId:req.params.id}, (err, docs) => {
        if (!err) res.status(200).send(docs);
        else return res.status(400).send("Error to get file: "+err);
      });
    } catch (err) {
        console.log("Error to get file : " + err);
    }
 };

 module.exports.getPatient = async (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send("ID unknown : " + req.params.id);

    UserModel.find({is_patient:true, _id:req.params.id}, (err, docs) => {
        if (!err) res.status(200).send(docs);
        else return res.status(400).send("Error to get data: "+err);
      });
 };

module.exports.getAllPatients = async (req, res) => {
    try {
        UserModel.find({is_patient:true}, (err, docs) => {
            if (!err) res.status(200).send(docs);
            else return res.status(400).send("Error to get patient: "+err);
      });
    } catch(err){
        console.log("Error to get Patient : " + err);
    }
 };

module.exports.createAllergyFile = (req, res) => {
    const {postId, posterId, specialistId} = req.body;
  try {
      const allergyFile = new AllergieFileModel({
        postId:postId, 
        posterId:posterId, 
        specialistId:specialistId,
        clinic_signature: [],
        symptoms: [],
      });
      
      allergyFile.save()
      .then(() => {  return res.status(201).send("id: "+_id);})
      .catch(err => res.status(500).send( "Error:" + err ));
  }
  catch(err){
      res.status(400).send({err});
  }
};


module.exports.editPatientFile = (req, res) => {
    if (!ObjectID.isValid(req.params.id)){
        return res.status(400).send("ID unknown : " + req.params.id);
    }
    AllergieFileModel.findByIdAndUpdate(
        req.params.id,
        {
            $set: {
            allergy_name: req.body.allergieName,
            description: req.body.description,
            },
            $addToSet: {
                clinic_sign: req.body.clinic_sign,
                symptom: req.body.symptom

            },
        },
        { new: true, upsert: true, setDefaultsOnInsert: true },
        (err, docs) => {
            if (!err) return res.status(200).send(docs);
            else return res.status(400).send("Update error: "+err);
        }
    );
};

module.exports.deleteFile = (req, res) => {
    if (!ObjectID.isValid(req.params.id)) {
      return res.status(400).send("ID unknown : " + req.params.id);
    }
  
    FileModel.findByIdAndRemove(req.params.id, (err, docs) => {
      if (!err) return res.status(200).send("message: File deleted !");
      else return res.status(400).send("Delete error: "+err);
    });
};


module.exports.follow = (req, res) => {
    if(!ObjectID.isValid(req.params.id) || !ObjectID.isValid(req.body.idToFollow)){
        return res.status(400).send('ID unknown: '+ req.params.id);
    } try {
        //adding to follower list
        SpecialistModel.findByIdAndUpdate(
            req.params.id,
            {$addToSet: {followings: req.body.idToFollow}},
            {new: true, upsert: true},
            (err, docs) =>{
                if (err) return res.status(400).send(err);
            }    
        );
    //add following list
    UserModel.findOneAndUpdate(
        {
            _id:req.body.idToFollow,
            is_patient:true,
            followers:{$size:0}
        },        
        {$addToSet: {followers: req.params.id}},
        {new: true, upsert: true},
        (err, docs) =>{
            if (err) return res.status(400).send(err);
        }    
    );
    FileModel.findOneAndUpdate(
        {
            patientId:req.body.idToFollow
        },        
        {
            $set:{
                specialistId: req.params.id
            },
        },
        { new: true, upsert: true, setDefaultsOnInsert: true },
        (err, docs) =>{
            if (!err) res.status(200).send(docs);
            else return res.status(400).send(err);
        }    
    );
    } catch(err){
        return res.status(500).send("message:" + err);
    }
};

module.exports.unfollow = async (req, res) => {
    if(!ObjectID.isValid(req.params.id) || !ObjectID.isValid(req.body.idToUnFollow))
        return res.status(400).send('ID unknown:', req.params.id);
    try {
         //remove to follower list
        SpecialistModel.findByIdAndUpdate(
            req.params.id,
            {$pull: {followings: req.body.idToUnFollow}},
            {new: true, upsert: true},
            (err, docs) =>{
                if (err) return res.status(400).send(err);
            }    
        );
    //remove to following list
     UserModel.findByIdAndUpdate(
        req.body.idToUnFollow,
        {$pull: {followers: req.params.id}},
        {new: true, upsert: true},
        (err, docs) =>{
            if (err) return res.status(400).send(err);
        }  
        
    );

    FileModel.findOneAndUpdate(
        {
            patientId:req.body.idToFollow
        },        
        {
            $set:{
                specialistId: null
            },
        },
        { new: true, upsert: true, setDefaultsOnInsert: true },
        (err, docs) =>{
            if (!err) return res.status(400).send(docs);
            else return res.status(400).send(err);
        }    
    );

    } catch(err){
        return res.status(500).send(err);
    }
};

