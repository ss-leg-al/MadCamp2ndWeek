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
  searchPosts: async (req, res) => {
    try {
      const { query } = req.query; // 쿼리 파라미터에서 검색어 가져오기

      if (!query) {
        return res.status(400).json({ error: 'Query parameter is required' });
      }

      // 제목 또는 내용에서 검색어 찾기
      const posts = await Post.find({
        $or: [
          { title: { $regex: query, $options: 'i' } }, // 대소문자 구분 없이 검색
          { content: { $regex: query, $options: 'i' } },
        ],
      });
      if (posts.length === 0) {
        return res.status(200).json({ message: 'No posts found', posts: [] });
      }
      res.status(200).json(posts);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

};


module.exports = postController;