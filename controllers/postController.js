const Post = require('../models/Post');

const postController = {
  createPost: async (req, res) => {
    try {
      const { title, content, videoUrl, authorId } = req.body;
      const post = new Post({ title, content, videoUrl, authorId });
      await post.save();
      res.status(201).json(post);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  getPosts: async (req, res) => {
    try {
      const posts = await Post.find().sort({ createdAt: -1 });
      res.json(posts);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  getPost: async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      if (!post) return res.status(404).json({ message: 'Post not found' });
      res.json(post);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};

module.exports = postController;