const express = require('express');
const router = express.Router();
const { postController, upload } = require('../controllers/postController');
const { authenticate } = require('../middlewares/authMiddleware');

router.get('/search', postController.searchPosts);
router.get('/:id', postController.getPost);
router.patch('/:id/like', postController.likePost);
router.post('/', upload.single('image'), postController.createPost); // 이미지 업로드 처리
router.get('/', postController.getPosts);
router.delete('/:id', postController.deletePost);

module.exports = router;