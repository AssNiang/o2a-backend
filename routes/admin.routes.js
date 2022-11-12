const router = require('express').Router();
const adminController = require('../controllers/admin.controller');


router.post('/create-specialist', adminController.createSpecialist); 
router.delete('/retire-specialist/:userId', adminController.retireSpecialist); // userId of the specialist in the body
router.get('/reported-posts', adminController.getReportedPosts);
router.get('/retired-accounts', adminController.getRetiredAccounts);
router.get('/all-accounts', adminController.getAllAccounts);
router.get('/no-retired-accounts', adminController.getNoRetiredAccounts);

router.get('/all-patients', adminController.getPatients); // à traiter
router.get('/followed-patients', adminController.getFollowedPatients); // à traiter
router.get('/unfollowed-patients', adminController.getUnFollowedPatients); // à traiter

router.put('/block-account', adminController.blockAccount);  // userId in the body
router.put('/unblock-account', adminController.unblockAccount); // userId in the body



module.exports = router;