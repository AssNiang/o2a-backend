const router = require('express').Router();
const adminController = require('../controllers/admin.controller');


router.post('/create-specialist', adminController.createSpecialist); // à traiter
router.delete('/retire-specialist', adminController.retireSpecialist); // à traiter
router.get('/reported-posts', adminController.getReportedPosts);
router.get('/retired-accounts', adminController.getRetiredAccounts);
router.get('/all-accounts', adminController.getAllAccounts);
router.get('/no-retired-accounts', adminController.getNoRetiredAccounts);
router.get('/all-patients', adminController.getPatients); // à traiter
router.get('/followed-patients', adminController.getFollowedPatients); // à traiter
router.get('/unfollowed-patients', adminController.getUnFollowedPatients); // à traiter

router.patch('/block-account/:id', adminController.blockAccount);  // à traiter
router.patch('/unblock-account/:id', adminController.unblockAccount);  // à traiter



module.exports = router;