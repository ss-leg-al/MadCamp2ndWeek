const Comment = require('../models/Comment');
const User = require('../models/User');
const pointsService = require('../services/pointsService');

const COMMENTER_REWARD = 10;

const commentController = {
  deleteComment: async (req, res) => {
    try {
      const { commentId } = req.params;
      const deletedComment = await Comment.findByIdAndDelete(commentId);
  
      if (!deletedComment) {
        return res.status(404).json({ message: 'Comment not found' });
      }
  
      res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (error) {
      console.error('Error deleting comment:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },
  createComment: async (req, res) => {
    try {
      const { postId, commenterId, content, pointsGiven } = req.body;

      // 댓글 작성자와 게시글 작성자 조회
      const commenter = await User.findById(commenterId);
      const postAuthor = await User.findById(req.body.postAuthorId);

      if (!commenter || !postAuthor) {
        return res.status(404).json({ message: 'User not found' });
      }

      // 댓글 작성자의 등급에 따른 포인트 범위 확인
      const { min, max } = pointsService.getPointsRangeByLevel(commenter.level);
      if (pointsGiven < min || pointsGiven > max) {
        return res.status(400).json({
          error: `Points must be between ${min} and ${max} for level ${commenter.level}.`,
        });
      }

      // 댓글 작성자에게 고정 포인트 추가
      await pointsService.addPoints(commenterId, COMMENTER_REWARD);

      // 게시글 작성자에게 선택된 포인트 추가
      await pointsService.addPoints(postAuthor._id, pointsGiven);

      // 댓글 저장
      const comment = new Comment({ postId, commenterId, content, pointsGiven });
      await comment.save();

      // 저장된 댓글에 작성자 이름 추가
      const populatedComment = await comment.populate('commenterId', 'name');

      res.status(201).json({ 
        message: 'Comment created and points updated.', 
        comment: populatedComment 
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  },

  getCommentsByPost: async (req, res) => {
    try {
      console.log("Request params:", req.params);
      const { postId } = req.params;
      console.log("Requested postId:", postId);

      // 해당 postId에 대한 댓글 검색
      const comments = await Comment.find({ postId })
        .populate("commenterId", "name")
        .sort({ createdAt: -1 });

      if (!comments || comments.length === 0) {
        return res.status(404).json({ message: 'No comments found for this post.' });
      }

      res.status(200).json(comments);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch comments.' });
    }
  },
};

module.exports = commentController;