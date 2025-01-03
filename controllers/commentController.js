const Comment = require('../models/Comment');
const User = require('../models/User');
const pointsService = require('../services/pointsService');

const COMMENTER_REWARD = 10;

const commentController = {
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

      res.status(201).json({ message: 'Comment created and points updated.', comment });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  },
};

module.exports = commentController;