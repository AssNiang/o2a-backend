const Health_structModel = require('./../models/health_struct.model');

module.exports.getAllHealth_struct = async (req, res) => {
  Health_structModel.find((err, docs) => {
    if (!err) return res.status(200).send(docs);
    else return res.status(400).send('Error to get data : ' + err);
  });
};

module.exports.addHealth_struct = (req, res) => {
  try {
    const health_struct = new Health_structModel({
      name: req.body.name,
      latitude: req.body.latitude,
      longitude: req.body.longitude,
    });
    health_struct
      .save()
      .then(() => res.status(201).send({ health_struct: health_struct }))
      .catch((error) => {
        res.status(400).send({ error: error });
        //console.log(error.message);
      });
  } catch (err) {
    res.status(400).send({ error: err });
  }
};
