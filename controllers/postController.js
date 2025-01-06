const Post = require('../models/Post');

const postController = {
  likePost: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.body.userId; // 프론트엔드에서 전달받은 유저 ID
      const post = await Post.findById(id);
  
      if (!post) {
        return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });
      }
  
      // 이미 좋아요를 누른 유저인지 확인
      if (post.likedBy.includes(userId)) {
        return res.status(400).json({ message: '이미 좋아요를 누르셨습니다.' });
      }
  
      // 좋아요 추가 및 유저 기록
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
      const post = new Post({ title, content, videoUrl, authorId });
      await post.save();
      res.status(201).json(post);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  getPosts: async (req, res) => {
    try {
      const posts = await Post.find()
        .populate('authorId', 'name') // authorId로 연결된 User의 username 가져오기
        .sort({ createdAt: -1 }); // 최신순 정렬
  
      res.status(200).json(posts);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to fetch posts' });
    }
  },

  getPost: async (req, res) => {
    try {
      const post = await Post.findById(req.params.id)
        .populate('authorId', 'name'); // authorId를 User와 연결, name 필드 가져오기
      if (!post) return res.status(404).json({ message: 'Post not found' });
      res.json(post);
    } catch (err) {
      console.error("Error fetching post:", err);
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
      })
      .populate('authorId', 'name') // authorId를 User 모델과 연결하여 name 필드 가져오기


      if (posts.length === 0) {
        return res.status(200).json({ message: 'No posts found', posts: [] });
      }

      res.status(200).json(posts);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  deletePost: async (req, res) => {
    try {
      const { id } = req.params;

    // 요청 사용자 정보
    const userId = req.user.id; // JWT에서 추출된 사용자 ID

    // 삭제할 포스트 검색
    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // 작성자 확인
    if (post.authorId.toString() !== userId) {
      return res.status(403).json({ message: 'You do not have permission to delete this post' });
    }

    // 포스트 삭제
    await Post.findByIdAndDelete(id);

    res.status(200).json({ message: 'Post deleted successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
};

module.exports = postController;