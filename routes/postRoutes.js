const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');

router.get('/search',postController.searchPosts);
router.get('/:id', postController.getPost);
router.post('/', postController.createPost);
router.get('/', postController.getPosts);



module.exports = router;