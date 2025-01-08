const multer = require('multer');
const path = require('path');
const Post = require('../models/Post');

// Multer 설정
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads'); // 이미지 저장 경로
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // 파일 이름 설정
  },
});

const upload = multer({ storage });

const postController = {
  likePost: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.body.userId;
      const post = await Post.findById(id);

      if (!post) {
        return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });
      }

      if (post.likedBy.includes(userId)) {
        return res.status(400).json({ message: '이미 좋아요를 누르셨습니다.' });
      }

      post.likes += 1;
      post.likedBy.push(userId);
      await post.save();

      res.status(200).json({ message: '좋아요가 성공적으로 추가되었습니다.', likes: post.likes });
    } catch (error) {
      console.error('좋아요 처리 중 오류:', error);
      res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
  },

  createPost: async (req, res) => {
    try {
      const { title, content, videoUrl, authorId } = req.body;
      const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

      const post = new Post({ title, content, videoUrl, imageUrl, authorId });
      await post.save();
      res.status(201).json(post);
    } catch (err) {
      console.error('Error creating post:', err);
      res.status(500).json({ error: err.message });
    }
  },

  getPosts: async (req, res) => {
    try {
      const posts = await Post.find()
        .populate('authorId', 'name')
        .sort({ createdAt: -1 });

      res.status(200).json(posts);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to fetch posts' });
    }
  },

  getPost: async (req, res) => {
    try {
      const post = await Post.findById(req.params.id)
        .populate('authorId', 'name');
      if (!post) return res.status(404).json({ message: 'Post not found' });
      res.json(post);
    } catch (err) {
      console.error('Error fetching post:', err);
      res.status(500).json({ error: err.message });
    }
  },

  searchPosts: async (req, res) => {
    try {
      const { query } = req.query;

      if (!query) {
        return res.status(400).json({ error: 'Query parameter is required' });
      }

      const posts = await Post.find({
        $or: [
          { title: { $regex: query, $options: 'i' } },
          { content: { $regex: query, $options: 'i' } },
        ],
      }).populate('authorId', 'name');

      res.status(200).json(posts);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  deletePost: async (req, res) => {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ message: "Post ID is required" });
      }
      const deletedPost = await Post.findByIdAndDelete(id);
      if (!deletedPost) {
        return res.status(404).json({ message: "Post not found" });
      }
      res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
      console.error("Error deleting post:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
};

module.exports = { postController, upload };