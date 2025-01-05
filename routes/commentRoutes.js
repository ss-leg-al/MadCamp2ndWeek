const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');


router.post('/:postId/comments', commentController.createComment);
router.get('/:postId/comments', commentController.getCommentsByPost); 

module.exports = router;