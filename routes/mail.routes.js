const router = require('express').Router();
const mailController = require('../controllers/mail.controller');

router.post('/send-mail', mailController.sendMail);


module.exports = router;