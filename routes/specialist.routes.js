const router = require('express').Router();
const specialistController = require('../controllers/specialist.controller');


router.get('/all-patients', specialistController.getAllPatients);
router.get('/patient/:id', specialistController.getPatient);
router.get('/get-all-file/:id', specialistController.getPatientFile);
router.get('/get-file', specialistController.getAllPatientsFiles);
router.post('/create-file', specialistController.createAllergyFile);
router.delete('/delete-file/:id', specialistController.deleteFile);
router.put('/edit-file', specialistController.editPatientFile);
router.patch('/follow/:id', specialistController.follow);
router.patch('/unfollow/:id', specialistController.unfollow);

module.exports = router;


