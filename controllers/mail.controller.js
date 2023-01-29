const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'allergySpace@gmail.com',
    pass: 'csfvqgizizpvchlw',
  },
  port: 465,
  host: 'smtp.gmail.com',
});

module.exports.sendMail = async (req, res) => {
  const mailOptions = {
    from: 'allergySpace@gmail.com',
    to: req.body.destination,
    subject: req.body.subject,
    text: req.body.text,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      res.send({error:error});
    } else {
      res.send({message: 'Email sent: ' + info.response});
    }
  });
};
