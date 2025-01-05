const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    videoUrl: { type: String },
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    likes: { type: Number, default: 0 }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Post', postSchema);