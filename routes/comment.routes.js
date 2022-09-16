const router = require('express').Router();
const commentController = require('../controllers/comment.controller');


// comments
router.post('comment/:id', commentController.comment);
router.get('/:id', commentController.getPostComments);
router.patch('/edit-comment/:id', commentController.editComment);
router.delete('/delete-comment/:id', commentController.deleteComment);
router.patch('/like-comment/:id', commentController.likeComment);
router.patch('/unlike-comment/:id', commentController.unlikeComment);
router.patch('/report-comment/:id', commentController.reportComment);
router.patch('/unreport-comment/:id', commentController.unReportComment); 



module.exports = router;