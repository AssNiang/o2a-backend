const router = require('express').Router();
const adminController = require('../controllers/admin.controller');


router.post('/create-specialist', adminController.createSpecialist);
router.get('/reported-posts', adminController.getReportedPosts);
router.get('/retired-accounts', adminController.getRetiredAccounts);
router.get('/all-accounts', adminController.getAllAccounts);
router.get('/no-retired-accounts', adminController.getNoRetiredAccounts);
router.get('/all-patients', adminController.getPatients);
router.get('/followed-patients', adminController.getFollowedPatients);
router.get('/unfollowed-patients', adminController.getUnFollowedPatients);




module.exports = router;