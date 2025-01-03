const Comment = require('../models/Comment');
const User = require('../models/User');

const COMMENT_REWARD = 10;

const commentController = {
  createComment: async (req, res) => {
    try {
      const { postId } = req.params;
      const { content, pointsGiven, commenterId } = req.body;

      const commenter = await User.findById(commenterId);
      const postAuthor = await User.findById(req.body.postAuthorId);

      if (!commenter || !postAuthor) {
        return res.status(404).json({ message: 'User not found' });
      }

      commenter.points += COMMENT_REWARD;
      postAuthor.points += pointsGiven;

      await commenter.save();
      await postAuthor.save();

      const comment = new Comment({ postId, content, pointsGiven, commenterId });
      await comment.save();
      res.status(201).json(comment);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};

module.exports = commentController;