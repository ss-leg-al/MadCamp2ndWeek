const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const { authenticate } = require('../middlewares/authMiddleware');


router.get('/search',postController.searchPosts);
router.get('/:id', postController.getPost);
router.patch('/:id/like',postController.likePost);
router.post('/', postController.createPost);
router.get('/', postController.getPosts);
router.delete('/:id', authenticate, postController.deletePost); // 인증 미들웨어 추가




module.exports = router;