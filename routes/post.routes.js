const router = require('express').Router();
const postController = require('../controllers/post.controller');
const multer = require("multer");
const upload = multer();

router.get('/', postController.readPost);
router.get('/historique-posts/:id', postController.getUserPosts);
router.post('/public-post', upload.single("file"), postController.createPublicPost);
router.post('/private-post', upload.single("file"), postController.createPrivatePost);
router.put('/update/:id', postController.updatePost);
router.delete('/:id', postController.deletePost);
router.patch('/like-post/:id', postController.likePost);
router.patch('/unlike-post/:id', postController.unlikePost);
router.patch('/report-post/:id', postController.reportPost);
router.patch('/unreport-post/:id', postController.unReportPost); 

module.exports = router;