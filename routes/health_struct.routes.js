const router = require('express').Router();
const health_structController = require('../controllers/health_struct.controller');

router.post('/add-health_struct', health_structController.addHealth_struct);
router.get('/all-health_struct', health_structController.getAllHealth_struct);


module.exports = router;