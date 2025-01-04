const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const { authenticate } = require('../middlewares/authMiddleware');

router.post('/', postController.createPost);
router.get('/', postController.getPosts);
router.get('/:id', postController.getPost);
router.delete('/:id', authenticate, postController.deletePost); // 인증 미들웨어 추가

module.exports = router;